interface LanguageVersion {
    readonly common: object
    readonly view: object
}

export interface Language {
    readonly name: string
    [index: string]: LanguageVersion | string
}