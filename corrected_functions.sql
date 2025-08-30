-- Function to determine channel
CREATE OR REPLACE FUNCTION lux_staging.get_sales_channel(
    p_sales_org TEXT,
    p_material_type TEXT,
    p_billing_type TEXT,
    p_business_area TEXT,
    p_sold_to_party TEXT,
    p_mat_desc TEXT,
    p_material_code TEXT
) RETURNS TEXT AS $$
BEGIN
    -- E-com
    IF p_sales_org = 'LI05' AND p_material_type IN ('FERT', 'HAWA') AND p_billing_type <> 'F3' 
       AND p_business_area IN ('LI29','LI42','LI43','LI44','LI45','LI46','LI47','LI48','LI49','LI50','LI51','LI52','LI53','LI54','LI55','LI56','LI70')
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'REJ%' THEN
        RETURN 'E-com';
    END IF;

    -- EBO
    IF p_sales_org = 'LI05' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area IN ('LI28', 'LI80')
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' THEN
        RETURN 'EBO';
    END IF;

    -- LFS
    IF p_sales_org <> 'LI05' AND p_sales_org IN ('3000','AR01','AS01','EB01','JM01','JM02','JM03','JT01','LC01','LC02','LC03','LC04','LC05','LC06','LI01','LI02','LI03','LI04','LI06','LI07','LI09','LI10','LX01','LX02','LX03','LX04','ON01')
       AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party) THEN
        RETURN 'LFS';
    END IF;

    -- Export
    IF p_material_type IN ('FERT', 'HAWA') AND p_billing_type IN ('F3','ZRE','ZRER','ZRF','ZRR')
       AND p_business_area NOT IN ('LI26', 'LI38') AND p_mat_desc NOT ILIKE 'REJ%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND EXISTS (SELECT 1 FROM lux_production.export_customer_list WHERE "Code" = p_sold_to_party) THEN
        RETURN 'Export';
    END IF;

    -- Export Domestic
    IF p_sales_org = 'LI04' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party) THEN
        RETURN 'Export Domestic';
    END IF;

    -- Lux Parker Inner
    IF p_sales_org = 'LI10' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' THEN
        RETURN 'Lux Parker Inner';
    END IF;

    -- Lux Pynk
    IF p_sales_org = 'LI09' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' THEN
        RETURN 'Lux Pynk';
    END IF;

    -- Onn - Winter
    IF p_sales_org IN ('LI02','LI03','LI07') AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND (EXISTS (SELECT 1 FROM lux_production.annexure_1 WHERE "Material_Number" = p_material_code)
            OR EXISTS (SELECT 1 FROM lux_production.annexure_2 WHERE "Material_Number" = p_material_code)) THEN
        RETURN 'Onn - Winter';
    END IF;

    -- Lux Cozi Outerwear Men
    IF p_sales_org = 'LI06' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = p_material_code) THEN
        RETURN 'Lux Cozi Outerwear Men';
    END IF;

    -- Winter
    IF p_sales_org = 'LI03' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_1 WHERE "Material_Number" = p_material_code) THEN
        RETURN 'Winter';
    END IF;

    -- Onn
    IF p_sales_org = 'LI02' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_2 WHERE "Material_Number" = p_material_code) THEN
        RETURN 'Onn';
    END IF;

    -- Lux Cozi
    IF p_sales_org = 'LI01' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND NOT EXISTS (SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = p_material_code) THEN
        RETURN 'Lux Cozi';
    END IF;

    -- Lux Cozi Boys
    IF p_sales_org IN ('LI01','LI06') AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
       AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3'
       AND NOT EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party)
       AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
       AND (p_mat_desc ILIKE '%boyz%' OR p_mat_desc ILIKE '%boys%')
       AND EXISTS (SELECT 1 FROM lux_production.annexure_3 WHERE "Material_Number" = p_material_code) THEN
        RETURN 'Lux Cozi Boys';
    END IF;

    -- Default logic
    IF EXISTS (SELECT 1 FROM lux_production.lfs_customer_list WHERE "Sold_to_Party" = p_sold_to_party) THEN
        RETURN 'LFS';
    END IF;

    RETURN 'Others';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to determine brand
CREATE OR REPLACE FUNCTION lux_staging.get_sales_brand(p_channel TEXT, p_material_number TEXT) RETURNS TEXT AS $$
BEGIN
    CASE 
        WHEN p_channel IN ('Lux Cozi', 'Lux Cozi Boys', 'Lux Cozi Outerwear Men') THEN RETURN 'Lux Cozi';
        WHEN p_channel IN ('Onn', 'Onn - Winter') THEN RETURN 'Onn';
        WHEN p_channel = 'Export Domestic' THEN RETURN 'Others';
        WHEN p_channel = 'Export' THEN RETURN 'Export';
        WHEN p_channel = 'Lux Pynk' THEN RETURN 'Lux Pynk';
        WHEN p_channel = 'Lux Parker Inner' THEN RETURN 'Lux Parker Inner';
        WHEN p_channel = 'Winter' THEN RETURN 'Winter';
        WHEN p_channel = 'Others' THEN RETURN 'Others';
        WHEN p_channel IN ('LFS', 'E-com', 'EBO') THEN
            IF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_number AND "Re_Brand" = 'Lux Cozi') THEN
                RETURN 'Lux Cozi';
            ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_number AND "Re_Brand" = 'Lux Winter') THEN
                RETURN 'Winter';
            ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_number AND "Re_Brand" = 'Lux Parker Inner') THEN
                RETURN 'Lux Parker Inner';
            ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_number AND "Re_Brand" = 'Lux Pynk') THEN
                RETURN 'Lux Pynk';
            ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_number AND "Re_Brand" = 'Onn') THEN
                RETURN 'Onn';
            ELSIF EXISTS (SELECT 1 FROM lux_production.brand_logic WHERE "Material_Number" = p_material_number AND "Re_Brand" = 'Others') THEN
                RETURN 'Others';
            END IF;
    END CASE;
    
    RETURN 'Others';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to map sizes
CREATE OR REPLACE FUNCTION lux_staging.get_mapped_size(p_material_size TEXT, p_gender TEXT) RETURNS TEXT AS $$
BEGIN
    IF COALESCE(p_gender, '') = 'KIDS' THEN
        RETURN CASE p_material_size
            WHEN '025' THEN '25'
            WHEN '030' THEN '30'
            WHEN '035' THEN '35'
            WHEN '040' THEN '40'
            WHEN '045' THEN '45'
            WHEN '050' THEN '50'
            WHEN '055' THEN '55'
            WHEN '060' THEN '60'
            WHEN '065' THEN '65'
            WHEN '070' THEN '70'
            WHEN '073' THEN '73'
            WHEN '075' THEN 'XS/75'
            WHEN '080' THEN 'S/80'
            WHEN '085' THEN 'M/85'
            WHEN '090' THEN 'L/90'
            WHEN '095' THEN 'XL/95'
            WHEN '100' THEN 'XXL/100'
            WHEN '00S' THEN 'S/80'
            WHEN '00M' THEN 'M/85'
            WHEN '00L' THEN 'L/90'
            WHEN '0XL' THEN 'XL/95'
            WHEN '0XS' THEN 'XS/75'
            WHEN 'XXL' THEN 'XXL/100'
            WHEN '3XL' THEN '3XL/105'
            WHEN '4XL' THEN '4XL/110'
            WHEN '5XL' THEN '5XL/115'
            ELSE 'FREE SIZE'
        END;
    ELSE
        RETURN CASE 
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
END;
$$ LANGUAGE plpgsql IMMUTABLE;