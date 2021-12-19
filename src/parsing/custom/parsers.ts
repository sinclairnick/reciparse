import { Recipe } from "../.."
import { AdamLiaw } from "./parsers/adam-liaw"

export const customParsers = {
	[AdamLiaw.domain]: AdamLiaw,
}

export const parseWithCustom = (html: string, domain: keyof typeof customParsers): Promise<Recipe | undefined> | Recipe | undefined => {
	return customParsers[domain]?.parse(html)
}

export const checkIsDomainSupported = (domain?: string): domain is keyof typeof customParsers => {
	return domain !== undefined && Object.keys(customParsers).includes(domain)
}
