export type PageMetaEntry = {
    number: number
    url: string
}

export type PageMeta = {
    first_page: PageMetaEntry 
    prev_page: PageMetaEntry 
    current_page: PageMetaEntry 
    next_page: PageMetaEntry 
    last_page: PageMetaEntry 
}