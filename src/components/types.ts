export interface BookdetailsData{
    aboutAuthor:string,
    aboutBook: string,
    authorName: string,
    coverPic: string,
    id: number,
    rating:string,
    readStatus: string,
    title: string
}

export interface ApiResponse{
    status:string,
    data:BookdetailsData|null,
    errorMsg:string|null
}
