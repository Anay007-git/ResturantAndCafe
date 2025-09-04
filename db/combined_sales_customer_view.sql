CREATE MATERIALIZED VIEW lux_staging.sales_customer_combined
TABLESPACE pg_default
AS
WITH customer_base AS (
  SELECT DISTINCT
    a_1.customer_number,
    a_1.sales_org,
    a_1.del_flag,
    a_1.cust_name,
    a_1.city,
    a_1.region_des AS state,
    a_1.country_key,
    a_1.changed_on,
    a_1.agent_code,
    CASE
      WHEN (CURRENT_DATE - a_1.changed_on::date) <= 30 
        THEN date_trunc('month'::text, CURRENT_DATE::timestamp with time zone)::date
      ELSE a_1.changed_on::date
    END AS tableau_cdc
  FROM lux_production."MS_SD_CUSTOMER_SALESORG_DTLS_PROD" a_1
  WHERE a_1.del_flag = false
),
customer_master AS (
  SELECT
    a.customer_number,
    a.sales_org,
    a.del_flag,
    a.cust_name,
    a.city,
    a.state,
    a.country_key,
    a.changed_on,
    b.supplier AS agent_code,
    CASE
      WHEN (a.customer_number IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) 
        AND b.supplier_name IS NULL 
        THEN 'Large Format Store'::text
      ELSE b.supplier_name
    END AS agent_name,
    a.tableau_cdc
  FROM customer_base a
  LEFT JOIN (
    SELECT DISTINCT x.supplier, x.supplier_name
    FROM lux_production."MS_PU_VENDOR_COMPANY_DTLS_PROD" x
  ) b ON a.agent_code = b.supplier
),
sales_base AS (
  SELECT 
    s.ref_num AS "Ref Num",
    s.billing_document AS "Billing Doc No",
    s.billing_type AS "Billing Type",
    s.sales_org AS "Sales Org ",
    s.billing_date AS "Billing Date",
    s.region AS "Region",
    s.comp_code AS "Company Code",
    s.sold_to_party AS "Sold To Party",
    s.material_code AS "Material Number",
    s.mat_desc AS "Material Desc",
    s.plant AS "Plant",
    s.dist_chan AS distribution_channel,
    s.sales_unit AS "Sales Unit",
    s.business_area AS "Business Area",
    s.profit_center AS "Profit Center",
    m.material_type AS "Material Type",
    m.industry_sector AS "Sub Brand (Industry Sec)",
    m.basic_material AS "Category (Basic Material)",
    m.material_style AS "Style (Material Style)",
    g."Gender" AS "Gender (Old Mat No)",
    m.base_mat_desc AS "Basic Material Desc",
    m.material_color AS "Color (Material color)",
    m.material_size AS "Size (Material Size)",
    CASE
      WHEN s.sales_org = 'LI05'::text AND (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND s.billing_type <> 'F3'::text AND (s.business_area = ANY (ARRAY['LI29'::text, 'LI42'::text, 'LI43'::text, 'LI44'::text, 'LI45'::text, 'LI46'::text, 'LI47'::text, 'LI48'::text, 'LI49'::text, 'LI50'::text, 'LI51'::text, 'LI52'::text, 'LI53'::text, 'LI54'::text, 'LI55'::text, 'LI56'::text, 'LI70'::text])) AND NOT (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) AND s.mat_desc !~~* 'REJ%'::text THEN 'E-com'::text
      WHEN s.sales_org = 'LI05'::text AND (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND (s.business_area = ANY (ARRAY['LI28'::text, 'LI80'::text])) AND NOT (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) AND s.mat_desc !~~* 'REJ%'::text AND s.billing_type <> 'F3'::text THEN 'EBO'::text
      WHEN s.sales_org <> 'LI05'::text AND (s.sales_org = ANY (ARRAY['3000'::text, 'AR01'::text, 'AS01'::text, 'EB01'::text, 'JM01'::text, 'JM02'::text, 'JM03'::text, 'JT01'::text, 'LC01'::text, 'LC02'::text, 'LC03'::text, 'LC04'::text, 'LC05'::text, 'LC06'::text, 'LI01'::text, 'LI02'::text, 'LI03'::text, 'LI04'::text, 'LI06'::text, 'LI07'::text, 'LI09'::text, 'LI10'::text, 'LX01'::text, 'LX02'::text, 'LX03'::text, 'LX04'::text, 'ON01'::text])) AND (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND (s.business_area <> ALL (ARRAY['LI26'::text, 'LI38'::text])) AND s.mat_desc !~~* 'REJ%'::text AND (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) THEN 'LFS'::text
      WHEN (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND (s.billing_type = ANY (ARRAY['F3'::text, 'ZRE'::text, 'ZRER'::text, 'ZRF'::text, 'ZRR'::text])) AND (s.business_area <> ALL (ARRAY['LI26'::text, 'LI38'::text])) AND s.mat_desc !~~* 'REJ%'::text AND NOT (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) AND (s.sold_to_party IN (SELECT export_customer_list."Code" FROM lux_production.export_customer_list)) THEN 'Export'::text
      WHEN s.sales_org = 'LI04'::text AND (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND (s.business_area <> ALL (ARRAY['LI26'::text, 'LI38'::text])) AND s.mat_desc !~~* 'REJ%'::text AND NOT (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) THEN 'Export Domestic'::text
      WHEN s.sales_org = 'LI10'::text AND (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND (s.business_area <> ALL (ARRAY['LI26'::text, 'LI38'::text])) AND s.mat_desc !~~* 'REJ%'::text AND s.billing_type <> 'F3'::text AND NOT (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) AND s.mat_desc !~~* 'AX%'::text AND s.mat_desc !~~* 'One8%'::text THEN 'Lux Parker Inner'::text
      WHEN s.sales_org = 'LI09'::text AND (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND (s.business_area <> ALL (ARRAY['LI26'::text, 'LI38'::text])) AND s.mat_desc !~~* 'REJ%'::text AND s.billing_type <> 'F3'::text AND NOT (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) AND s.mat_desc !~~* 'AX%'::text AND s.mat_desc !~~* 'One8%'::text THEN 'Lux Pynk'::text
      WHEN (s.sales_org = ANY (ARRAY['LI02'::text, 'LI03'::text, 'LI07'::text])) AND (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND (s.business_area <> ALL (ARRAY['LI26'::text, 'LI38'::text])) AND s.mat_desc !~~* 'REJ%'::text AND ((s.material_code IN (SELECT annexure_1."Material_Number" FROM lux_production.annexure_1)) OR (s.material_code IN (SELECT annexure_2."Material_Number" FROM lux_production.annexure_2))) AND s.billing_type <> 'F3'::text AND NOT (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) AND s.mat_desc !~~* 'AX%'::text AND s.mat_desc !~~* 'One8%'::text THEN 'Onn - Winter'::text
      WHEN s.sales_org = 'LI06'::text AND (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND (s.business_area <> ALL (ARRAY['LI26'::text, 'LI38'::text])) AND s.mat_desc !~~* 'REJ%'::text AND NOT (s.material_code IN (SELECT annexure_3."Material_Number" FROM lux_production.annexure_3)) AND s.billing_type <> 'F3'::text AND NOT (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) AND s.mat_desc !~~* 'AX%'::text AND s.mat_desc !~~* 'One8%'::text THEN 'Lux Cozi Outerwear Men'::text
      WHEN s.sales_org = 'LI03'::text AND (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND (s.business_area <> ALL (ARRAY['LI26'::text, 'LI38'::text])) AND s.mat_desc !~~* 'REJ%'::text AND NOT (s.material_code IN (SELECT annexure_1."Material_Number" FROM lux_production.annexure_1)) AND s.billing_type <> 'F3'::text AND NOT (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) AND s.mat_desc !~~* 'AX%'::text AND s.mat_desc !~~* 'One8%'::text THEN 'Winter'::text
      WHEN s.sales_org = 'LI02'::text AND (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND (s.business_area <> ALL (ARRAY['LI26'::text, 'LI38'::text])) AND s.mat_desc !~~* 'REJ%'::text AND NOT (s.material_code IN (SELECT annexure_2."Material_Number" FROM lux_production.annexure_2)) AND s.billing_type <> 'F3'::text AND NOT (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) AND s.mat_desc !~~* 'AX%'::text AND s.mat_desc !~~* 'One8%'::text THEN 'Onn'::text
      WHEN s.sales_org = 'LI01'::text AND (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND (s.business_area <> ALL (ARRAY['LI26'::text, 'LI38'::text])) AND s.mat_desc !~~* 'REJ%'::text AND NOT (s.material_code IN (SELECT annexure_3."Material_Number" FROM lux_production.annexure_3)) AND s.billing_type <> 'F3'::text AND NOT (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) AND s.mat_desc !~~* 'AX%'::text AND s.mat_desc !~~* 'One8%'::text THEN 'Lux Cozi'::text
      WHEN (s.sales_org = ANY (ARRAY['LI01'::text, 'LI06'::text])) AND (m.material_type = ANY (ARRAY['FERT'::text, 'HAWA'::text])) AND (s.business_area <> ALL (ARRAY['LI26'::text, 'LI38'::text])) AND s.mat_desc !~~* 'REJ%'::text AND (s.mat_desc ~~* '%boyz%'::text OR s.mat_desc ~~* '%boys%'::text) AND (s.material_code IN (SELECT annexure_3."Material_Number" FROM lux_production.annexure_3)) AND s.billing_type <> 'F3'::text AND NOT (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) AND s.mat_desc !~~* 'AX%'::text AND s.mat_desc !~~* 'One8%'::text THEN 'Lux Cozi Boys'::text
      WHEN (m.material_type = ANY (ARRAY['ZYRN'::text, 'DIEN'::text])) AND s.billing_type <> 'F3'::text AND (s.business_area = ANY (ARRAY['LI26'::text, 'LI38'::text])) AND (s.mat_desc ~~ 'AX%'::text OR s.mat_desc ~~ 'One8%'::text) AND s.sold_to_party = 'PAR01'::text AND (s.material_code IN (SELECT annexure_4."Material_Number" FROM lux_production.annexure_4)) AND s.mat_desc ~~* 'REJ%'::text THEN 'Others'::text
      ELSE CASE WHEN (s.sold_to_party IN (SELECT lfs_customer_list."Sold_to_Party" FROM lux_production.lfs_customer_list)) THEN 'LFS'::text ELSE 'Others'::text END
    END AS channel,
    s.no_of_pkg::numeric AS no_of_pkg,
    s.net_amt / NULLIF(s.exch_rate, 0::double precision) AS net_amt_fc,
    s.tax_amt / NULLIF(s.exch_rate, 0::double precision) AS tax_amt_fc,
    s.cost_amt / NULLIF(s.exch_rate, 0::double precision) AS cost_amt_fc,
    CASE WHEN s.billing_type = ANY (ARRAY['ZRE'::text, 'ZRER'::text, 'ZRF'::text, 'ZRR'::text, 'ZRES'::text]) THEN '-1'::integer::double precision * s.actual_billed_quantity ELSE s.actual_billed_quantity END AS actual_billed_qty,
    CASE WHEN s.billing_type = ANY (ARRAY['ZRE'::text, 'ZRER'::text, 'ZRF'::text, 'ZRR'::text, 'ZRES'::text]) THEN '-1'::integer::double precision * s."billing_qty_in_PC" ELSE s."billing_qty_in_PC" END AS billing_qty_pc,
    CASE WHEN s.billing_type = ANY (ARRAY['ZRE'::text, 'ZRER'::text, 'ZRF'::text, 'ZRR'::text, 'ZRES'::text]) THEN '-1'::integer::double precision * s.cost_amt ELSE s.cost_amt END AS cost_amt_adj,
    CASE WHEN s.billing_type = ANY (ARRAY['ZRE'::text, 'ZRER'::text, 'ZRF'::text, 'ZRR'::text, 'ZRES'::text]) THEN CASE WHEN s.doc_curr = 'USD'::text OR s.sold_to_party = 'NPBI002'::text THEN '-1'::integer::double precision * (s.tax_amt + s.net_amt) ELSE '-1'::integer::double precision * s.net_amt END ELSE CASE WHEN s.doc_curr = 'USD'::text OR s.sold_to_party = 'NPBI002'::text THEN s.tax_amt + s.net_amt ELSE s.net_amt END END AS gross_sales,
    CASE
      WHEN (m.material_size = ANY (ARRAY['025'::text])) AND g."Gender"::text = 'KIDS'::text THEN '25'::text
      WHEN (m.material_size = ANY (ARRAY['030'::text])) AND g."Gender"::text = 'KIDS'::text THEN '30'::text
      WHEN (m.material_size = ANY (ARRAY['035'::text])) AND g."Gender"::text = 'KIDS'::text THEN '35'::text
      WHEN (m.material_size = ANY (ARRAY['040'::text])) AND g."Gender"::text = 'KIDS'::text THEN '40'::text
      WHEN (m.material_size = ANY (ARRAY['045'::text])) AND g."Gender"::text = 'KIDS'::text THEN '45'::text
      WHEN (m.material_size = ANY (ARRAY['050'::text])) AND g."Gender"::text = 'KIDS'::text THEN '50'::text
      WHEN (m.material_size = ANY (ARRAY['055'::text])) AND g."Gender"::text = 'KIDS'::text THEN '55'::text
      WHEN (m.material_size = ANY (ARRAY['060'::text])) AND g."Gender"::text = 'KIDS'::text THEN '60'::text
      WHEN (m.material_size = ANY (ARRAY['065'::text])) AND g."Gender"::text = 'KIDS'::text THEN '65'::text
      WHEN (m.material_size = ANY (ARRAY['070'::text])) AND g."Gender"::text = 'KIDS'::text THEN '70'::text
      WHEN (m.material_size = ANY (ARRAY['073'::text])) AND g."Gender"::text = 'KIDS'::text THEN '73'::text
      WHEN (m.material_size = ANY (ARRAY['075'::text])) AND g."Gender"::text = 'KIDS'::text THEN 'XS/75'::text
      WHEN (m.material_size = ANY (ARRAY['080'::text])) AND g."Gender"::text = 'KIDS'::text THEN 'S/80'::text
      WHEN (m.material_size = ANY (ARRAY['085'::text])) AND g."Gender"::text = 'KIDS'::text THEN 'M/85'::text
      WHEN (m.material_size = ANY (ARRAY['090'::text])) AND g."Gender"::text = 'KIDS'::text THEN 'L/90'::text
      WHEN (m.material_size = ANY (ARRAY['095'::text])) AND g."Gender"::text = 'KIDS'::text THEN 'XL/95'::text
      WHEN (m.material_size = ANY (ARRAY['100'::text])) AND g."Gender"::text = 'KIDS'::text THEN 'XXL/100'::text
      WHEN (m.material_size = ANY (ARRAY['00S'::text])) AND g."Gender"::text = 'KIDS'::text THEN 'S/80'::text
      WHEN (m.material_size = ANY (ARRAY['00M'::text])) AND g."Gender"::text = 'KIDS'::text THEN 'M/85'::text
      WHEN (m.material_size = ANY (ARRAY['00L'::text])) AND g."Gender"::text = 'KIDS'::text THEN 'L/90'::text
      WHEN (m.material_size = ANY (ARRAY['0XL'::text])) AND g."Gender"::text = 'KIDS'::text THEN 'XL/95'::text
      WHEN (m.material_size = ANY (ARRAY['0XS'::text])) AND g."Gender"::text = 'KIDS'::text THEN 'XS/75'::text
      WHEN (m.material_size = ANY (ARRAY['XXL'::text])) AND g."Gender"::text = 'KIDS'::text THEN 'XXL/100'::text
      WHEN (m.material_size = ANY (ARRAY['3XL'::text])) AND g."Gender"::text = 'KIDS'::text THEN '3XL/105'::text
      WHEN (m.material_size = ANY (ARRAY['4XL'::text])) AND g."Gender"::text = 'KIDS'::text THEN '4XL/110'::text
      WHEN (m.material_size = ANY (ARRAY['5XL'::text])) AND g."Gender"::text = 'KIDS'::text THEN '5XL/115'::text
      WHEN (m.material_size = ANY (ARRAY['0XS'::text, '030'::text, '075'::text])) AND COALESCE(g."Gender", ''::character varying)::text <> 'KIDS'::text THEN 'XS/75'::text
      WHEN (m.material_size = ANY (ARRAY['00S'::text, '032'::text, '080'::text])) AND COALESCE(g."Gender", ''::character varying)::text <> 'KIDS'::text THEN 'S/80'::text
      WHEN (m.material_size = ANY (ARRAY['00M'::text, '034'::text, '085'::text])) AND COALESCE(g."Gender", ''::character varying)::text <> 'KIDS'::text THEN 'M/85'::text
      WHEN (m.material_size = ANY (ARRAY['00L'::text, '036'::text, '090'::text])) AND COALESCE(g."Gender", ''::character varying)::text <> 'KIDS'::text THEN 'L/90'::text
      WHEN (m.material_size = ANY (ARRAY['0XL'::text, '038'::text, '095'::text])) AND COALESCE(g."Gender", ''::character varying)::text <> 'KIDS'::text THEN 'XL/95'::text
      WHEN (m.material_size = ANY (ARRAY['XXL'::text, '2XL'::text, '040'::text, '100'::text])) AND COALESCE(g."Gender", ''::character varying)::text <> 'KIDS'::text THEN 'XXL/100'::text
      WHEN (m.material_size = ANY (ARRAY['3XL'::text, '042'::text, '105'::text])) AND COALESCE(g."Gender", ''::character varying)::text <> 'KIDS'::text THEN '3XL/105'::text
      WHEN (m.material_size = ANY (ARRAY['4XL'::text, '044'::text, '110'::text])) AND COALESCE(g."Gender", ''::character varying)::text <> 'KIDS'::text THEN '4XL/110'::text
      WHEN (m.material_size = ANY (ARRAY['5XL'::text, '046'::text, '115'::text, 'SXL'::text])) AND COALESCE(g."Gender", ''::character varying)::text <> 'KIDS'::text THEN '5XL/115'::text
      WHEN (m.material_size = ANY (ARRAY['6XL'::text, '048'::text, '120'::text])) AND COALESCE(g."Gender", ''::character varying)::text <> 'KIDS'::text THEN '6XL/120'::text
      ELSE 'FREE SIZE'::text
    END AS mapped_size
  FROM lux_production."TR_SD_BILL_customer_DTLS_PROD" s
  LEFT JOIN lux_staging.report_material_master m ON s.material_code = m.material_number
  LEFT JOIN lux_production.gender g ON m.old_matl_number = g.old_matl_number::text
  WHERE s.biliing_status = false 
    AND (s.billing_type = ANY (ARRAY['F2'::text, 'F3'::text, 'IV'::text, 'FOCT'::text, 'ZRES'::text, 'ZRE'::text, 'ZRER'::text, 'ZRF'::text, 'ZRR'::text])) 
    AND (m.material_type IS NULL OR (m.material_type <> ALL (ARRAY['ZYRN'::text, 'DIEN'::text]))) 
    AND NOT (s.sold_to_party IN (SELECT cust_exclusion."Cust_code" FROM lux_production.cust_exclusion))
)
SELECT 
  s."Ref Num",
  s."Billing Doc No",
  s."Billing Type",
  s."Sales Org ",
  s."Region",
  s."Company Code",
  s."Billing Date",
  s."Sold To Party",
  s."Material Number",
  s."Material Desc",
  s."Plant",
  s.distribution_channel,
  s."Sales Unit",
  s."Business Area",
  s."Profit Center",
  s."Material Type",
  s."Sub Brand (Industry Sec)",
  s."Category (Basic Material)",
  s."Style (Material Style)",
  s."Gender (Old Mat No)",
  s."Basic Material Desc",
  s."Color (Material color)",
  s."Size (Material Size)",
  s.channel,
  s.mapped_size,
  CASE
    WHEN s.channel = ANY (ARRAY['Lux Cozi'::text, 'Lux Cozi Boys'::text, 'Lux Cozi Outerwear Men'::text]) THEN 'Lux Cozi'::text
    WHEN s.channel = ANY (ARRAY['Onn'::text, 'Onn - Winter'::text]) THEN 'Onn'::text
    WHEN s.channel = 'Export Domestic'::text THEN 'Others'::text
    WHEN s.channel = 'Export'::text THEN 'Export'::text
    WHEN s.channel = 'Lux Pynk'::text THEN 'Lux Pynk'::text
    WHEN s.channel = 'Lux Parker Inner'::text THEN 'Lux Parker Inner'::text
    WHEN s.channel = 'Winter'::text THEN 'Winter'::text
    WHEN s.channel = 'Others'::text THEN 'Others'::text
    WHEN (s.channel = ANY (ARRAY['LFS'::text, 'E-com'::text, 'EBO'::text])) AND (s."Material Number" IN (SELECT brand_logic."Material_Number" FROM lux_production.brand_logic WHERE brand_logic."Re_Brand" = 'Lux Cozi'::text)) THEN 'Lux Cozi'::text
    WHEN (s.channel = ANY (ARRAY['LFS'::text, 'E-com'::text, 'EBO'::text])) AND (s."Material Number" IN (SELECT brand_logic."Material_Number" FROM lux_production.brand_logic WHERE brand_logic."Re_Brand" = 'Lux Winter'::text)) THEN 'Winter'::text
    WHEN (s.channel = ANY (ARRAY['LFS'::text, 'E-com'::text, 'EBO'::text])) AND (s."Material Number" IN (SELECT brand_logic."Material_Number" FROM lux_production.brand_logic WHERE brand_logic."Re_Brand" = 'Lux Parker Inner'::text)) THEN 'Lux Parker Inner'::text
    WHEN (s.channel = ANY (ARRAY['LFS'::text, 'E-com'::text, 'EBO'::text])) AND (s."Material Number" IN (SELECT brand_logic."Material_Number" FROM lux_production.brand_logic WHERE brand_logic."Re_Brand" = 'Lux Pynk'::text)) THEN 'Lux Pynk'::text
    WHEN (s.channel = ANY (ARRAY['LFS'::text, 'E-com'::text, 'EBO'::text])) AND (s."Material Number" IN (SELECT brand_logic."Material_Number" FROM lux_production.brand_logic WHERE brand_logic."Re_Brand" = 'Onn'::text)) THEN 'Onn'::text
    WHEN (s.channel = ANY (ARRAY['LFS'::text, 'E-com'::text, 'EBO'::text])) AND (s."Material Number" IN (SELECT brand_logic."Material_Number" FROM lux_production.brand_logic WHERE brand_logic."Re_Brand" = 'Others'::text)) THEN 'Others'::text
    ELSE 'Others'::text
  END AS brand,
  sum(s.no_of_pkg) AS "Total Number of Package",
  sum(s.net_amt_fc) AS "net_amt_FC",
  sum(s.tax_amt_fc) AS "tax_amt_FC",
  sum(s.cost_amt_fc) AS "cost_amt_FC",
  sum(s.actual_billed_qty) AS total_actual_billed_quantity,
  sum(s.billing_qty_pc) AS "Total qty",
  sum(s.cost_amt_adj) AS "Total COGS",
  sum(s.gross_sales) AS "Total Gross Sales",
  c.cust_name,
  c.city,
  c.state,
  c.country_key,
  c.agent_code AS customer_agent_code,
  c.agent_name,
  c.tableau_cdc
FROM sales_base s
LEFT JOIN customer_master c ON s."Sold To Party" = c.customer_number AND s."Sales Org " = c.sales_org
GROUP BY s."Ref Num", s."Billing Doc No", s."Billing Type", s."Sales Org ", s."Billing Date", s."Region", s."Company Code", s."Sold To Party", s."Material Number", s."Material Desc", s."Plant", s.distribution_channel, s."Sales Unit", s."Business Area", s."Profit Center", s."Material Type", s."Sub Brand (Industry Sec)", s."Category (Basic Material)", s."Style (Material Style)", s."Gender (Old Mat No)", s."Basic Material Desc", s."Color (Material color)", s."Size (Material Size)", s.channel, s.mapped_size, c.cust_name, c.city, c.state, c.country_key, c.agent_code, c.agent_name, c.tableau_cdc
WITH DATA;