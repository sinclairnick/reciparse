import { Recipe } from "../.."

export const CreateParser = <D extends string>(domain: D) => {
	return class extends Parser<typeof domain> {
		domain = domain
	}
}

export class Parser<D extends string> {
	domain: D
	parse: (html: string) => Promise<Recipe | undefined> | Recipe | undefined
}

export const createParser = <D extends string>(opts: Parser<D>) => {
	return opts
}