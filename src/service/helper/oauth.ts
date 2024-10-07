import { router as $router } from '@/service/core/router'

/**đăng xuất */
export const signout = () => {
    // xoá dữ liệu của DB
    $indexed_db.clear(() => {})

    // @ts-ignore
    // ldb.clear()

    // xoá dữ liệu local
    localStorage.clear()

    // chuyển hướng qua trang login
    $router.push('/oauth')

    // reload lại trang để xoá dữ liệu store
    setTimeout(() => {
        location.reload()

    }, 200)
}