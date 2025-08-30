-- Single function returning channel, brand, and size
CREATE OR REPLACE FUNCTION lux_staging.get_channel_brand_size(
    p_sales_org TEXT,
    p_material_type TEXT,
    p_billing_type TEXT,
    p_business_area TEXT,
    p_sold_to_party TEXT,
    p_mat_desc TEXT,
    p_material_code TEXT,
    p_material_size TEXT,
    p_old_matl_number TEXT
) RETURNS TABLE(channel TEXT, brand TEXT, mapped_size TEXT) AS $$
DECLARE
    v_channel TEXT;
    v_brand TEXT;
    v_size TEXT;
    v_gender TEXT;
BEGIN
    -- Get gender from gender table
    SELECT "Gender" INTO v_gender 
    FROM lux_production.gender 
    WHERE old_matl_number::text = p_old_matl_number;
    -- Channel logic
    IF p_sales_org = 'LI05' AND p_material_type IN ('FERT', 'HAWA') AND p_billing_type <> 'F3' 
       AND p_business_area IN ('LI29','LI42','LI43','LI44','LI45','LI46','LI47','LI48','LI49','LI50','LI51','LI52','LI53','LI54','LI55','LI56','LI70')
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'REJ%' THEN
        v_channel := 'E-com';
    ELSIF p_sales_org = 'LI05' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area IN ('LI28', 'LI80')
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' THEN
        v_channel := 'EBO';
    ELSIF p_sales_org <> 'LI05' AND p_sales_org IN ('3000','AR01','AS01','EB01','JM01','JM02','JM03','JT01','LC01','LC02','LC03','LC04','LC05','LC06','LI01','LI02','LI03','LI04','LI06','LI07','LI09','LI10','LX01','LX02','LX03','LX04','ON01')
       AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party) THEN
        v_channel := 'LFS';
    ELSIF p_material_type IN ('FERT', 'HAWA') AND p_billing_type IN ('F3','ZRE','ZRER','ZRF','ZRR')
       AND p_business_area NOT IN ('LI26', 'LI38') AND p_mat_desc NOT ILIKE 'REJ%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND EXISTS (SELECT 1 FROM lux_production.export_customer_list WHERE "Code" = p_sold_to_party) THEN
        v_channel := 'Export';
    ELSIF p_sales_org = 'LI04' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party) THEN
        v_channel := 'Export Domestic';
    ELSIF p_sales_org = 'LI10' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' THEN
        v_channel := 'Lux Parker Inner';
    ELSIF p_sales_org = 'LI09' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' THEN
        v_channel := 'Lux Pynk';
    ELSIF p_sales_org IN ('LI02','LI03','LI07') AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND (EXISTS (SELECT 1 FROM lux_production.annexure_1 WHERE "Material_Number" = p_material_code)
            OR EXISTS (SELECT 1 FROM lux_production.annexure_2 WHERE "Material_Number" = p_material_code)) THEN
        v_channel := 'Onn - Winter';
    ELSIF p_sales_org = 'LI06' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = p_material_code) THEN
        v_channel := 'Lux Cozi Outerwear Men';
    ELSIF p_sales_org = 'LI03' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_1 WHERE "Material_Number" = p_material_code) THEN
        v_channel := 'Winter';
    ELSIF p_sales_org = 'LI02' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_2 WHERE "Material_Number" = p_material_code) THEN
        v_channel := 'Onn';
    ELSIF p_sales_org = 'LI01' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = p_material_code) THEN
        v_channel := 'Lux Cozi';
    ELSIF p_sales_org IN ('LI01','LI06') AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND (p_mat_desc ILIKE '%boyz%' OR p_mat_desc ILIKE '%boys%')
       AND EXISTS (SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = p_material_code) THEN
        v_channel := 'Lux Cozi Boys';
    ELSIF EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party) THEN
        v_channel := 'LFS';
    ELSE
        v_channel := 'Others';
    END IF;

    -- Brand logic
    IF v_channel IN ('Lux Cozi', 'Lux Cozi Boys', 'Lux Cozi Outerwear Men') THEN
        v_brand := 'Lux Cozi';
    ELSIF v_channel IN ('Onn', 'Onn - Winter') THEN
        v_brand := 'Onn';
    ELSIF v_channel = 'Export Domestic' THEN
        v_brand := 'Others';
    ELSIF v_channel = 'Export' THEN
        v_brand := 'Export';
    ELSIF v_channel = 'Lux Pynk' THEN
        v_brand := 'Lux Pynk';
    ELSIF v_channel = 'Lux Parker Inner' THEN
        v_brand := 'Lux Parker Inner';
    ELSIF v_channel = 'Winter' THEN
        v_brand := 'Winter';
    ELSIF v_channel = 'Others' THEN
        v_brand := 'Others';
    ELSIF v_channel IN ('LFS', 'E-com', 'EBO') THEN
        IF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_code AND "Re_Brand" = 'Lux Cozi') THEN
            v_brand := 'Lux Cozi';
        ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_code AND "Re_Brand" = 'Lux Winter') THEN
            v_brand := 'Winter';
        ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_code AND "Re_Brand" = 'Lux Parker Inner') THEN
            v_brand := 'Lux Parker Inner';
        ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_code AND "Re_Brand" = 'Lux Pynk') THEN
            v_brand := 'Lux Pynk';
        ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_code AND "Re_Brand" = 'Onn') THEN
            v_brand := 'Onn';
        ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_code AND "Re_Brand" = 'Others') THEN
            v_brand := 'Others';
        ELSE
            v_brand := 'Others';
        END IF;
    ELSE
        v_brand := 'Others';
    END IF;

    -- Size mapping
    IF COALESCE(v_gender, '') = 'KIDS' THEN
        v_size := CASE p_material_size
            WHEN '025' THEN '25' WHEN '030' THEN '30' WHEN '035' THEN '35' WHEN '040' THEN '40' WHEN '045' THEN '45'
            WHEN '050' THEN '50' WHEN '055' THEN '55' WHEN '060' THEN '60' WHEN '065' THEN '65' WHEN '070' THEN '70'
            WHEN '073' THEN '73' WHEN '075' THEN 'XS/75' WHEN '080' THEN 'S/80' WHEN '085' THEN 'M/85' WHEN '090' THEN 'L/90'
            WHEN '095' THEN 'XL/95' WHEN '100' THEN 'XXL/100' WHEN '00S' THEN 'S/80' WHEN '00M' THEN 'M/85' WHEN '00L' THEN 'L/90'
            WHEN '0XL' THEN 'XL/95' WHEN '0XS' THEN 'XS/75' WHEN 'XXL' THEN 'XXL/100' WHEN '3XL' THEN '3XL/105'
            WHEN '4XL' THEN '4XL/110' WHEN '5XL' THEN '5XL/115' ELSE 'FREE SIZE'
        END;
    ELSE
        v_size := CASE 
            WHEN p_material_size IN ('0XS', '030', '075') THEN 'XS/75'
            WHEN p_material_size IN ('00S', '032', '080') THEN 'S/80'
            WHEN p_material_size IN ('00M', '034', '085') THEN 'M/85'
            WHEN p_material_size IN ('00L', '036', '090') THEN 'L/90'
            WHEN p_material_size IN ('0XL', '038', '095') THEN 'XL/95'
            WHEN p_material_size IN ('XXL', '2XL', '040', '100') THEN 'XXL/100'
            WHEN p_material_size IN ('3XL', '042', '105') THEN '3XL/105'
            WHEN p_material_size IN ('4XL', '044', '110') THEN '4XL/110'
            WHEN p_material_size IN ('5XL', '046', '115', 'SXL') THEN '5XL/115'
            WHEN p_material_size IN ('6XL', '048', '120') THEN '6XL/120'
            ELSE 'FREE SIZE'
        END;
    END IF;

    RETURN QUERY SELECT v_channel, v_brand, v_size;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Usage in materialized view:
-- SELECT *, (lux_staging.get_channel_brand_size(...)).* FROM base;