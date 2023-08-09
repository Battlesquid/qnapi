export const toYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export const fromYYYYMMDD = (date: string) => {
    const [year, month, day] = date.split("-");
    return new Date(parseInt(year), parseInt(month), parseInt(day))
}
