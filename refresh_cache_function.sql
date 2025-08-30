-- Function to refresh cache tables
CREATE OR REPLACE FUNCTION lux_staging.refresh_cache_tables() RETURNS VOID AS $$
BEGIN
    -- Refresh all cache tables
    DROP TABLE IF EXISTS lux_staging.cache_lfs;
    DROP TABLE IF EXISTS lux_staging.cache_export;
    DROP TABLE IF EXISTS lux_staging.cache_annexure_1;
    DROP TABLE IF EXISTS lux_staging.cache_annexure_2;
    DROP TABLE IF EXISTS lux_staging.cache_annexure_3;
    DROP TABLE IF EXISTS lux_staging.cache_brand_logic;
    DROP TABLE IF EXISTS lux_staging.cache_gender;

    CREATE TABLE lux_staging.cache_lfs AS SELECT "Sold_to_Party" FROM lux_production.lfs_customer_list;
    CREATE TABLE lux_staging.cache_export AS SELECT "Code" FROM lux_production.export_customer_list;
    CREATE TABLE lux_staging.cache_annexure_1 AS SELECT "Material_Number" FROM lux_production.annexure_1;
    CREATE TABLE lux_staging.cache_annexure_2 AS SELECT "Material_Number" FROM lux_production.annexure_2;
    CREATE TABLE lux_staging.cache_annexure_3 AS SELECT "Material_Number" FROM lux_production.annexure_3;
    CREATE TABLE lux_staging.cache_brand_logic AS SELECT "Material_Number", "Re_Brand" FROM lux_production.brand_logic;
    CREATE TABLE lux_staging.cache_gender AS SELECT old_matl_number::text, "Gender" FROM lux_production.gender;

    CREATE INDEX ON lux_staging.cache_lfs("Sold_to_Party");
    CREATE INDEX ON lux_staging.cache_export("Code");
    CREATE INDEX ON lux_staging.cache_annexure_1("Material_Number");
    CREATE INDEX ON lux_staging.cache_annexure_2("Material_Number");
    CREATE INDEX ON lux_staging.cache_annexure_3("Material_Number");
    CREATE INDEX ON lux_staging.cache_brand_logic("Material_Number");
    CREATE INDEX ON lux_staging.cache_gender(old_matl_number);
END;
$$ LANGUAGE plpgsql;

-- Fast cached function (same as before)
CREATE OR REPLACE FUNCTION lux_staging.get_channel_brand_size_cached(
    p_sales_org TEXT, p_material_type TEXT, p_billing_type TEXT, p_business_area TEXT,
    p_sold_to_party TEXT, p_mat_desc TEXT, p_material_code TEXT, p_material_size TEXT, p_old_matl_number TEXT
) RETURNS TABLE(channel TEXT, brand TEXT, mapped_size TEXT) AS $$
DECLARE
    v_channel TEXT; v_brand TEXT; v_size TEXT; v_gender TEXT; v_brand_logic TEXT;
    v_is_lfs BOOLEAN; v_is_export BOOLEAN; v_in_a1 BOOLEAN; v_in_a2 BOOLEAN; v_in_a3 BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM lux_staging.cache_lfs WHERE "Sold_to_Party" = p_sold_to_party) INTO v_is_lfs;
    SELECT EXISTS(SELECT 1 FROM lux_staging.cache_export WHERE "Code" = p_sold_to_party) INTO v_is_export;
    SELECT EXISTS(SELECT 1 FROM lux_staging.cache_annexure_1 WHERE "Material_Number" = p_material_code) INTO v_in_a1;
    SELECT EXISTS(SELECT 1 FROM lux_staging.cache_annexure_2 WHERE "Material_Number" = p_material_code) INTO v_in_a2;
    SELECT EXISTS(SELECT 1 FROM lux_staging.cache_annexure_3 WHERE "Material_Number" = p_material_code) INTO v_in_a3;
    SELECT "Gender" INTO v_gender FROM lux_staging.cache_gender WHERE old_matl_number = p_old_matl_number;
    SELECT "Re_Brand" INTO v_brand_logic FROM lux_staging.cache_brand_logic WHERE "Material_Number" = p_material_code LIMIT 1;

    v_channel := CASE
        WHEN p_sales_org = 'LI05' AND p_material_type IN ('FERT', 'HAWA') AND p_billing_type <> 'F3' 
             AND p_business_area IN ('LI29','LI42','LI43','LI44','LI45','LI46','LI47','LI48','LI49','LI50','LI51','LI52','LI53','LI54','LI55','LI56','LI70')
             AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'REJ%' THEN 'E-com'
        WHEN p_sales_org = 'LI05' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area IN ('LI28', 'LI80')
             AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' THEN 'EBO'
        WHEN p_sales_org <> 'LI05' AND p_sales_org IN ('3000','AR01','AS01','EB01','JM01','JM02','JM03','JT01','LC01','LC02','LC03','LC04','LC05','LC06','LI01','LI02','LI03','LI04','LI06','LI07','LI09','LI10','LX01','LX02','LX03','LX04','ON01')
             AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38') AND p_mat_desc NOT ILIKE 'REJ%' AND v_is_lfs THEN 'LFS'
        WHEN p_material_type IN ('FERT', 'HAWA') AND p_billing_type IN ('F3','ZRE','ZRER','ZRF','ZRR') AND p_business_area NOT IN ('LI26', 'LI38') 
             AND p_mat_desc NOT ILIKE 'REJ%' AND NOT v_is_lfs AND v_is_export THEN 'Export'
        WHEN p_sales_org = 'LI04' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND NOT v_is_lfs THEN 'Export Domestic'
        WHEN p_sales_org = 'LI10' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' THEN 'Lux Parker Inner'
        WHEN p_sales_org = 'LI09' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' THEN 'Lux Pynk'
        WHEN p_sales_org IN ('LI02','LI03','LI07') AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
             AND (v_in_a1 OR v_in_a2) THEN 'Onn - Winter'
        WHEN p_sales_org = 'LI06' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' AND NOT v_in_a3 THEN 'Lux Cozi Outerwear Men'
        WHEN p_sales_org = 'LI03' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' AND NOT v_in_a1 THEN 'Winter'
        WHEN p_sales_org = 'LI02' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' AND NOT v_in_a2 THEN 'Onn'
        WHEN p_sales_org = 'LI01' AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%' AND NOT v_in_a3 THEN 'Lux Cozi'
        WHEN p_sales_org IN ('LI01','LI06') AND p_material_type IN ('FERT', 'HAWA') AND p_business_area NOT IN ('LI26', 'LI38')
             AND p_mat_desc NOT ILIKE 'REJ%' AND p_billing_type <> 'F3' AND NOT v_is_lfs AND p_mat_desc NOT ILIKE 'AX%' AND p_mat_desc NOT ILIKE 'One8%'
             AND (p_mat_desc ILIKE '%boyz%' OR p_mat_desc ILIKE '%boys%') AND v_in_a3 THEN 'Lux Cozi Boys'
        WHEN v_is_lfs THEN 'LFS'
        ELSE 'Others'
    END;

    v_brand := CASE 
        WHEN v_channel IN ('Lux Cozi', 'Lux Cozi Boys', 'Lux Cozi Outerwear Men') THEN 'Lux Cozi'
        WHEN v_channel IN ('Onn', 'Onn - Winter') THEN 'Onn'
        WHEN v_channel = 'Export Domestic' THEN 'Others'
        WHEN v_channel = 'Export' THEN 'Export'
        WHEN v_channel = 'Lux Pynk' THEN 'Lux Pynk'
        WHEN v_channel = 'Lux Parker Inner' THEN 'Lux Parker Inner'
        WHEN v_channel = 'Winter' THEN 'Winter'
        WHEN v_channel = 'Others' THEN 'Others'
        WHEN v_channel IN ('LFS', 'E-com', 'EBO') THEN COALESCE(v_brand_logic, 'Others')
        ELSE 'Others'
    END;

    v_size := CASE
        WHEN COALESCE(v_gender, '') = 'KIDS' THEN
            CASE p_material_size
                WHEN '025' THEN '25' WHEN '030' THEN '30' WHEN '035' THEN '35' WHEN '040' THEN '40' WHEN '045' THEN '45'
                WHEN '050' THEN '50' WHEN '055' THEN '55' WHEN '060' THEN '60' WHEN '065' THEN '65' WHEN '070' THEN '70'
                WHEN '073' THEN '73' WHEN '075' THEN 'XS/75' WHEN '080' THEN 'S/80' WHEN '085' THEN 'M/85' WHEN '090' THEN 'L/90'
                WHEN '095' THEN 'XL/95' WHEN '100' THEN 'XXL/100' WHEN '00S' THEN 'S/80' WHEN '00M' THEN 'M/85' WHEN '00L' THEN 'L/90'
                WHEN '0XL' THEN 'XL/95' WHEN '0XS' THEN 'XS/75' WHEN 'XXL' THEN 'XXL/100' WHEN '3XL' THEN '3XL/105'
                WHEN '4XL' THEN '4XL/110' WHEN '5XL' THEN '5XL/115' ELSE 'FREE SIZE'
            END
        ELSE
            CASE 
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
            END
    END;

    RETURN QUERY SELECT v_channel, v_brand, v_size;
END;
$$ LANGUAGE plpgsql STABLE;

-- Usage: Call this after your SharePoint job completes
-- SELECT lux_staging.refresh_cache_tables();