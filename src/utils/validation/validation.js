export const checkIsEmailValid = (email) => {
    return email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
}

export const getInputsRules = (name, warningInputText, passwordCurrent, required = true) => {
    let rules = {required: (required === true || required === undefined)}
    if (name === "email") {
        rules = {...rules, pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/}
    }
    if (name === "password") {
        rules = {
            ...rules, minLength: {
                value: 8,
                message: warningInputText[name]
            }
        }
    }
    if(name === "passCheck") {
        rules = {
            ...rules, validate: value =>
                value === passwordCurrent || warningInputText[name]
        }
    }
    return rules
}