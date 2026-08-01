# Briefs del reporte SEO de julio 2026 · dónde está la versión buena

Once tareas. Diez viven como markdown en esta carpeta. **La Tarea 9 solo existe como Google Doc**, y su markdown en el repo está obsoleto.

## La versión que manda

| # | Tarea | Markdown en esta carpeta | Google Doc (lo que revisa Alejandra) |
|---|---|---|---|
| 1 | Consistent Tenant Experience | `brief-t1-consistent-tenant-experience.md` | https://docs.google.com/document/d/1cDEo1G14MngcrLPW2jp5OsEJjFxo9SXbjEYhqcgJR68/edit |
| 2 | Facebook Marketplace Rental Scams | `brief-t2-fb-marketplace-scams.md` | https://docs.google.com/document/d/1bMNjVIJG0qB83y5FU1tYXqvenzJ_jqXu0lSiEHH6r60/edit |
| 3 | Third-Party Property Managers | `brief-t3-third-party-pms.md` | https://docs.google.com/document/d/1N5j5xCKw9JxEGfPN9SRdTXN-2f3cOzCbEK1Rav17X08/edit |
| 4 | Compliance and Risk Reduction | `brief-t4-compliance-risk.md` | https://docs.google.com/document/d/1KEWwzWSLTFLGLCIrayk3haroW9mHAggZ5r147Z1hZmY/edit |
| 5 | Post-Showing Pricing Intelligence | `brief-t5-post-showing-pricing.md` | https://docs.google.com/document/d/1zTwf9DM8H--LrdDMCj-Dh-McR_kXYaciYfvn81eXRqY/edit |
| 6 | Multi-Property Listing Consistency | `brief-t6-multi-property.md` | https://docs.google.com/document/d/1_4G_8uKDqCIfnIS_LI_43khlUFCmPzkgtcPduuBBmYc/edit |
| 7 | Student Housing Leasing Automation | `brief-t7-student-housing.md` | https://docs.google.com/document/d/1X6tb8Gjg7y7NfStaUba1N1x7N9652htY_UWN-2IkM54/edit |
| 8 | Lease-Up Software | `brief-t8-lease-up.md` | https://docs.google.com/document/d/1zN3gn0MMBSNc_dOT7FGFnAJU5nmzMcE4hTiataiLbQ4/edit |
| **9** | **PM Software Cost** | **NO HAY. El markdown de `output/2026-07-27/` es la v1 obsoleta y está renombrado con sufijo OBSOLETA** | **https://docs.google.com/document/d/1f0nk49bc3clvUYXB8EPwquPNr4uadkzvNhbK30MP6ns/edit** |
| 10 | Outsourcing Property Management | `brief-t10-outsourcing.md` | https://docs.google.com/document/d/1qJQK_kvpAoDJsqD849cA7CAsHfqiCHWBMwhLSYCtQfE/edit |
| 11 | Security Deposit Deduction Letter | `brief-t11-security-deposit.md` | https://docs.google.com/document/d/1UK63pcvdx7-Ng2I46lS8Ft6hvn38MHY-76FFKA1xsec/edit |

## Y encima de todos ellos

**ADENDA · decisiones de Walter y limitaciones resueltas**
`ADENDA-decisiones-y-limitaciones-resueltas.md`
https://docs.google.com/document/d/1CgHtoCHZVZjdY7FYIhz7XMNrSvZn77Bx1D5t-c76k-U/edit

La adenda **manda sobre los briefs individuales** donde haya diferencia. Contiene cinco decisiones de Walter y la corrección de la canónica de la Tarea 2, que los briefs individuales todavía no reflejan en su cuerpo. Quien ejecute debe leer la adenda antes que el brief.

## Por qué la Tarea 9 es un caso aparte

El brief T9 se escribió primero, se revisó con los agentes, y se encontraron doce correcciones. La versión corregida (v2) se publicó directamente como Google Doc y nunca se guardó como markdown. El archivo del 27 de julio es la v1 con los errores dentro: enlaza a `/compare/` (404) y a `/author/juan-leal` (404), afirma que `/smart-rent-pricing/` está eliminada (está viva), y su mapa de headings omite cinco H2 reales.

Está renombrado a `brief-t9-pm-software-cost-OBSOLETA-usar-v2.md` para que nadie lo tome por bueno. Si hace falta la v2 en el repo, hay que exportarla del Google Doc a mano: el token de los scripts tiene scope `drive.file` y solo ve archivos que él mismo creó, no los que creó el conector de Drive.

## QA

`node scripts/qa-briefs.mjs output/2026-07-28/briefs` revisa mecánicamente todo el lote: recuenta los caracteres de cada meta title y description contra lo que declara el brief, y busca em-dashes, palabras prohibidas, cifras condicionales y URLs muertas usadas sin marcarlas. Al 28 de julio el lote pasa sin hallazgos.

Lo que el script no ve (contradicciones entre briefs, keywords que se canibalizan, calidad del análisis top-3) lo revisa el agente `brief-compliance`.
