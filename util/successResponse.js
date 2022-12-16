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
