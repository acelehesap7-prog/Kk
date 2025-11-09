-- Güvenli bir şekilde yatırma adresi oluşturmak için bir fonksiyon
create or replace function generate_deposit_address(
    p_user_id uuid,
    p_symbol varchar,
    p_network varchar
) returns varchar
language plpgsql
security definer
as $$
declare
    v_address varchar;
    v_network_id uuid;
begin
    -- Ağ ID'sini al
    select id into v_network_id
    from networks
    where name = p_network
    and enabled = true
    and is_deposit_enabled = true;

    if not found then
        raise exception 'Network not found or not enabled for deposits';
    end if;

    -- Mevcut adresi kontrol et
    select deposit_address into v_address
    from assets
    where user_id = p_user_id
    and symbol = p_symbol;

    -- Adres varsa döndür
    if v_address is not null then
        return v_address;
    end if;

    -- Burada gerçek bir adres oluşturma servisi entegre edilmeli
    -- Örnek olarak rastgele bir adres oluşturuyoruz
    -- NOT: Gerçek uygulamada bu bir API çağrısı olmalı
    v_address := encode(gen_random_bytes(20), 'hex');

    -- Adresi kaydet
    update assets
    set deposit_address = v_address,
        updated_at = now()
    where user_id = p_user_id
    and symbol = p_symbol;

    return v_address;
end;
$$;

-- Bakiye güncelleme fonksiyonu
create or replace function update_asset_balance(
    p_user_id uuid,
    p_symbol varchar,
    p_amount decimal
) returns void
language plpgsql
security definer
as $$
begin
    update assets
    set balance = balance + p_amount,
        updated_at = now()
    where user_id = p_user_id
    and symbol = p_symbol;

    if not found then
        insert into assets (user_id, symbol, balance)
        values (p_user_id, p_symbol, p_amount);
    end if;
end;
$$;