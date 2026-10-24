import Swal from 'sweetalert2'

// 1. 成功提示
export const showSuccess = (title, text = '') => {
    return Swal.fire({
        icon: 'success',
        title,
        text,
        confirmButtonColor: '#0d6efd', // 匹配 Bootstrap Primary 色系
        timer: 2000
    })
}

// 2. 錯誤提示
export const showError = (title, text = '') => {
    return Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonColor: '#dc3545'
    })
}

// 3. 確認對話框 (替代 confirm())
export const showConfirm = async (title, text = '此動作無法復原！') => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '確定',
        cancelButtonText: '取消'
    })
    return result.isConfirmed
}

// 4. 訊息對話框 (替代 alert())
export const showInfo = async (title, text = '') => {
    await Swal.fire({
        title,
        text,
        icon: 'info',
        confirmButtonColor: '#0d31fd',
        timer: 3000        
    })
}