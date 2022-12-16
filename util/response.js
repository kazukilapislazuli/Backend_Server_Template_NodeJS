exports.successResponse = (result, count = 0, total = 0, msg = 'Success', status = 200) => {
    return {
        success: true,
        count: count,
        totalCount: total,
        data: result,
        status: status,
        message: msg,
        time: Date.now(),
        error: null
    }
}

exports.errorResponse = (msg = 'Data not found', status = 404, data = null) => {
    return {
        success: false,
        data,
        status: status,
        time: Date.now(),
        error: {
            code: status,
            message: msg
        }
    }
}
