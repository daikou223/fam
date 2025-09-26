class ModalSelections{
    constructor(message,selection){
        this.message = message
        this.selection= selection
    }
}

class select{
    constructor(selectMessage,color = "#E4DCDC"){
        this.selectMessage = selectMessage
        this.color = color
    }
}

export {ModalSelections,select}