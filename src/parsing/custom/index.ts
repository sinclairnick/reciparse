import { URL } from "url"
import { Recipe } from "../.."
import { AdamLiaw } from "./parsers/adam-liaw"

const parsers = {
	[AdamLiaw.domain]: AdamLiaw,
}

export const parseWithCustom = (html: string, domain: keyof typeof parsers): Promise<Recipe | undefined> | Recipe | undefined => {
	return parsers[domain]?.parse(html)
}

export const checkIsDomainSupported = (domain?: string): domain is keyof typeof parsers => {
	return domain !== undefined && Object.keys(parsers).includes(domain)
}


export const validateForCustomDomain = (url: string):
	| { hasCustomParser: true, domain: keyof typeof parsers }
	| { hasCustomParser: false, domain: string } => {
	const urlObject = new URL(url)
	const domain = urlObject.host

	const isDomainSupported = checkIsDomainSupported(domain)

	return isDomainSupported ? { hasCustomParser: true, domain } : { hasCustomParser: false, domain }
}