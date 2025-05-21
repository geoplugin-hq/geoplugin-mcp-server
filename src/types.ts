import { z } from "zod";

export const GeopluginIPResponseSchema = z.object({
  geoplugin_request: z.string(),
  geoplugin_status: z.number(),
  geoplugin_credit: z.string(),
  geoplugin_region: z.string().nullable(),
  geoplugin_areaCode: z.string().nullable(),
  geoplugin_dmaCode: z.string().nullable(),
  geoplugin_countryName: z.string(),
  geoplugin_countryCode: z.string(),
  geoplugin_euVATrate: z.string().nullable(),
  geoplugin_continentName: z.string(),
  geoplugin_inEU: z.string().nullable(),
  geoplugin_continentCode: z.string(),
  geoplugin_city: z.string(),
  geoplugin_regionName: z.string(),
  geoplugin_regionCode: z.string(),
  geoplugin_postal_code: z.string().nullable(),
  geoplugin_longitude: z.number(),
  geoplugin_latitude: z.number(),
  geoplugin_locationAccuracyRadius: z.string().nullable(),
  geoplugin_timezone: z.string(),
  geoplugin_currencyCode: z.string(),
  geoplugin_currencySymbol: z.string(),
  geoplugin_currencyConverter: z.number(),
  geoplugin_currencySymbol_UTF8: z.string(),
  languages: z.array(z.string()),
});

export type GeopluginIPResponse = z.infer<typeof GeopluginIPResponseSchema>;
