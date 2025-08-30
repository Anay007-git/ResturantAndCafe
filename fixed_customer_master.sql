-- Fixed lux_staging.customer_master source

CREATE MATERIALIZED VIEW lux_staging.customer_master
TABLESPACE pg_default
AS SELECT customer_number,
    a.sales_org,
    a.dist_chan,
    a.division,
    a.del_flag,
    a.cust_group AS agent_group,
    a.cust_pri_grp,
    a.price_list_type,
    a.country_key,
    a.cust_name,
    b.city,
    a.post_code,
    a.region,
    b.description,
    a.cust_auth_grp,
    a.changed_on,
    a.account_grp,
    a.pan_no,
    b.supplier AS agent_name,
    a.payment_term,
    a.sales_agent_desc AS agent_group_desc,
    a.gst_num,
        CASE
            WHEN (CURRENT_DATE - a.changed_on::date) <= 30 THEN date_trunc('month'::text, CURRENT_DATE::timestamp with time zone)::date
            ELSE a.changed_on::date
        END AS tableau_cdc
   FROM lux_production."MS_SD_CUSTOMER_SALESORG_DTLS_PROD" a
   LEFT JOIN lux_production."MS_PU_VENDOR_COMPANY_DTLS_PROD" b ON a.agent_code = b.supplier
WITH DATA;