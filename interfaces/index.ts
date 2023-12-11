export type Product = {
    id: number
    nama: string
    deskripsi: string
    harga: number
    stok: number
    foto: string
    supplier_id: number
}

export type Supplier = {
    id_suplier: number
    nama_suplier: string
    alamat: string
    email: string
}

export type ResponseMessage = {
    message: string
}