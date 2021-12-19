import { URL } from "url";

export const RECIPE_SCHEMA_URL = 'http://schema.org/Recipe'


export const isNotNull = <T = any>(val?: T | null): val is T => val != null
export const removeTabChars = (val: string) => val.replace(/\t/g, "")
export const replaceNewlines = (val: string, withVal = " ") => val.replace(/\n/g, withVal)
export const checkIsValidUrl = (url: string) => {
	try {
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
};
