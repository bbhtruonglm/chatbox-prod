import { router as $router } from '@/service/core/router'

/**đăng xuất */
export const signout = () => {
    localStorage.clear()

    $router.push('/oauth')
}