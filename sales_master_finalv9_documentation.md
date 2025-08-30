# Sales Master Final v9 - Hardcoded Values & Dependencies

## Table Dependencies

### Primary Tables
- `lux_production.TR_SD_BILL_customer_DTLS_PROD` (main sales data)
- `lux_staging.report_material_master` (material master data)
- `lux_production.gender` (gender mapping)

### Reference Tables
- `lux_production.lfs_customer_list`
- `lux_production.export_customer_list`
- `lux_production.annexure_1`
- `lux_production.annexure_2`
- `lux_production.annexure_3`
- `lux_production.annexure_4`
- `lux_production.brand_logic`
- `lux_production.cust_exclusion`

## Hardcoded Values

### Sales Organizations
```sql
'LI05', '3000', 'AR01', 'AS01', 'EB01', 'JM01', 'JM02', 'JM03', 
'JT01', 'LC01', 'LC02', 'LC03', 'LC04', 'LC05', 'LC06', 'LI01', 
'LI02', 'LI03', 'LI04', 'LI06', 'LI07', 'LI09', 'LI10', 'LX01', 
'LX02', 'LX03', 'LX04', 'ON01'
```

### Business Areas
```sql
'LI29', 'LI42', 'LI43', 'LI44', 'LI45', 'LI46', 'LI47', 'LI48', 
'LI49', 'LI50', 'LI51', 'LI52', 'LI53', 'LI54', 'LI55', 'LI56', 
'LI70', 'LI28', 'LI80', 'LI26', 'LI38'
```

### Material Types
```sql
'FERT', 'HAWA', 'ZYRN', 'DIEN'
```

### Billing Types
```sql
'F2', 'F3', 'IV', 'FOCT', 'ZRES', 'ZRE', 'ZRER', 'ZRF', 'ZRR'
```

### Channel Classification Logic
- **E-com**: LI05 + FERT/HAWA + specific business areas + non-LFS customers
- **EBO**: LI05 + FERT/HAWA + LI28/LI80 business areas
- **LFS**: Non-LI05 orgs + FERT/HAWA + LFS customers
- **Export**: FERT/HAWA + F3/ZRE/ZRER/ZRF/ZRR billing types + export customers
- **Export Domestic**: LI04 + FERT/HAWA + non-LFS customers
- **Lux Parker Inner**: LI10 + FERT/HAWA + excludes AX%/One8% materials
- **Lux Pynk**: LI09 + FERT/HAWA + excludes AX%/One8% materials
- **Onn - Winter**: LI02/LI03/LI07 + materials in annexure_1/annexure_2
- **Lux Cozi Outerwear Men**: LI06 + excludes annexure_3 materials
- **Winter**: LI03 + excludes annexure_1 materials
- **Onn**: LI02 + excludes annexure_2 materials
- **Lux Cozi**: LI01 + excludes annexure_3 materials
- **Lux Cozi Boys**: LI01/LI06 + materials with 'boyz'/'boys' + in annexure_3

### Size Mapping
#### Kids Sizes
```sql
'025'→'25', '030'→'30', '035'→'35', '040'→'40', '045'→'45',
'050'→'50', '055'→'55', '060'→'60', '065'→'65', '070'→'70',
'073'→'73', '075'→'XS/75', '080'→'S/80', '085'→'M/85',
'090'→'L/90', '095'→'XL/95', '100'→'XXL/100'
```

#### Adult Sizes
```sql
'0XS','030','075'→'XS/75'
'00S','032','080'→'S/80'
'00M','034','085'→'M/85'
'00L','036','090'→'L/90'
'0XL','038','095'→'XL/95'
'XXL','2XL','040','100'→'XXL/100'
'3XL','042','105'→'3XL/105'
'4XL','044','110'→'4XL/110'
'5XL','046','115','SXL'→'5XL/115'
'6XL','048','120'→'6XL/120'
```

### Brand Logic
- **Lux Cozi**: Lux Cozi, Lux Cozi Boys, Lux Cozi Outerwear Men channels
- **Onn**: Onn, Onn - Winter channels
- **Export**: Export channel
- **Others**: Export Domestic and Others channels
- **LFS/E-com/EBO**: Brand determined by brand_logic table lookup

### Special Customers
- **PAR01**: Special handling for AX%/One8% materials
- **NPBI002**: USD currency handling

### Exclusions
- Materials starting with 'REJ%'
- Materials starting with 'AX%' or 'One8%' (context-dependent)
- Customers in cust_exclusion table
- Material types ZYRN, DIEN (filtered out)

## Key Business Rules
1. Returns (ZRE, ZRER, ZRF, ZRR, ZRES) multiply quantities by -1
2. USD currency and NPBI002 customer include tax in gross sales
3. Size mapping differs for KIDS vs non-KIDS gender
4. Channel classification follows hierarchical logic with multiple conditions
5. Brand assignment uses both channel and material-based logic