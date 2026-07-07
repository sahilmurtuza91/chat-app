class ApiResponse {
    constructor(statuCode, message, data=null){
        this.success=true;
        this.statuCode = statuCode;
        this.message = message;
        this.data = data;
    }
}

module.exports = ApiResponse;