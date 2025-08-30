WITH a AS (
         SELECT DISTINCT a_1.customer_number,
            a_1.sales_org,
            a_1.del_flag,
            a_1.cust_name,
            a_1.city,
            a_1.region_des AS state,
            a_1.changed_on,
            a_1.agent_code,
                CASE
                    WHEN (CURRENT_DATE - a_1.changed_on::date) <= 30 THEN date_trunc('month'::text, CURRENT_DATE::timestamp with time zone)::date
                    ELSE a_1.changed_on::date
                END AS tableau_cdc
           FROM lux_production."MS_SD_CUSTOMER_SALESORG_DTLS_PROD" a_1
          WHERE a_1.del_flag = false
        )
 SELECT a.customer_number,
    a.sales_org,
    a.del_flag,
    a.cust_name,
    a.city,
    a.state,
    a.changed_on,
    b.supplier AS agent_code,
    CASE 
        WHEN (a.customer_number IN ( SELECT lfs_customer_list."Sold_to_Party"
                       FROM lux_production.lfs_customer_list)) AND b.supplier_name IS NULL 
                       THEN 'Large Format Store'
         ELSE b.supplier_name
         END AS agent_name,
        CASE
            WHEN (CURRENT_DATE - a.changed_on::date) <= 30 THEN date_trunc('month'::text, CURRENT_DATE::timestamp with time zone)::date
            ELSE a.changed_on::date
        END AS tableau_cdc
   FROM a
     LEFT JOIN ( SELECT DISTINCT x.supplier,
            x.supplier_name
           FROM lux_production."MS_PU_VENDOR_COMPANY_DTLS_PROD" x) b ON a.agent_code = b.supplier;