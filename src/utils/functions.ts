import { ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import * as moment from 'moment';

moment.locale("pt-br");


/**
 * Substitui os caracteres acentuados de uma string
 * @param str 
 */
export function replaceAccents(str:string) {

    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    var newStr = str.split('');
    var aux:any = null;

    for (let i = 0; i < str.length; i++) {
        if ((aux = accents.indexOf(str[i])) != -1) {
            newStr[i] = accentsOut[aux];
        }
    }

    return newStr.join('');
    
}

/**
 * Formata uma string para dinheiro
 * @param value
 * @returns string
 */
export function moneyText(value: any) {
	value = Math.abs(parseFloat(parseFloat(value).toFixed(2)));
	return value.toLocaleString('de-DE', { minimumFractionDigits: 2 });
}

/**
 * Formata uma string para número inteiro com separador de milhar
 * @param value
 * @returns string
 */
export function numberText(value: any) {
    value = Math.abs(parseFloat(parseFloat(value).toFixed(0)));
    return value.toLocaleString('de-DE', { minimumFractionDigits: 0 });
}

/**
 * Retorna um objeto com ou sem chaves especificadas
 * @param obj 
 * @param keys 
 * @param omit 
 * @returns 
 */
export function filterObjectKeys(obj:any, keys:string[], omit:boolean = false) {

    let dup:any = {};

    Object.keys(obj).forEach((key:string) => {

        if ((keys.indexOf(key) == -1 && omit) || (keys.indexOf(key) != -1) && !omit) {
            dup[key] = obj[key];
        }

    });

    return dup;

}

/**
 * Retorna uma determinada validação para o campo
 * TODO -> Transformar em diretiva
 * @param type 
 * @param param 
 */
export function formValidator(type:string, param:number|string|null = 0, param2:number|string|null = 0): ValidatorFn {

    return (control: AbstractControl) => {

        let formValue:any = control.value;
        let isFormValueNull: boolean = !formValue || formValue == "" || typeof formValue === "undefined";

		if (type == "required") {

			if (isFormValueNull) {
                return { required: true, actual: formValue, message: "Este campo é obrigatório." }
			}

		} else if (type == "min") {

			if (formValue && formValue < (param || 0)) {
                return { min: param, actual: formValue, message: ("O valor mínimo para este campo é " + param + ".") }
			}
			
		} else if (type == "max") {

			if (formValue && formValue > (param || 0)) {
                return { max: param, actual: formValue, message: ("O valor máximo para este campo é " + param + ".") }
			}

		} else if (type == "minLength") {

			if (formValue && formValue.length < (param || 0)) {
                return { minLength: param, actual: formValue, message: ("Este campo deve ter no mínimo " + param + " caracteres.") }
			}

		} else if (type == "maxLength") {

			if (formValue && formValue.length > (param || 0)) {
                return { maxLength: param, actual: formValue, message: ("Este campo deve ter no máximo " + param + " caracteres.") }
			}

		} else if (type == "email") {

			if (formValue && !formValue.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                return { actual: formValue, message: "Este e-mail é inválido." }
			}

		} else if (type == "doc") {

			if (formValue) {

                let valueLength = mask(formValue, 'doc').length;

				if (valueLength != 14 && valueLength != 18) {
                    return { actual: valueLength, message: "Este documento é inválido." }

				} else if (valueLength == 14 && !isCPFValid(formValue)) {
                    return { actual: valueLength, message: "Este CPF é inválido." }

				} else if (valueLength == 18 && !isCNPJValid(formValue)) {
                    return { actual: valueLength, message: "Este CNPJ é inválido." }
                }

            }

        } else if (type == "phone") {

            if (formValue) {

                if (mask(formValue, 'phone').length != 15) {
                    return {actual: formValue, message: "Esse telefone é inválido."}
			    }

            }

		} else if (type == "date") {

            if (formValue) {

                if (formValue.length == 8) {

                    let value:string|string[] = mask(formValue, "dateBr").split("-");
                    
                    value = value.reverse();
                    value = value.join("-");
    
                    let dateMoment = moment(value);
    
                    if (dateMoment?.isValid()) {

                        //Verifica a data é válida de acordo com uma mínima e máxima específicada
                        let minDate = param ? moment(param) : null;
                        let maxDate = param2 ? moment(param2) : null;

                        if (minDate && dateMoment.isBefore(minDate)) {
                            return {actual: formValue, message: ("Essa data deve ser igual ou maior que " + minDate.format("DD/MM/YYYY"))}
                        }

                        if (maxDate && dateMoment.isAfter(maxDate)) {
                            return {actual: formValue, message: ("Essa data deve ser igual ou menor que " + maxDate.format("DD/MM/YYYY"))}
                        }
    
                    } else {
                        return {actual: formValue, message: "Essa data é inválida."}
                    }

                } else {
                    return {actual: formValue, message: "Essa data é inválida."}
                }

            }

        } else if (type == "time") {
            
            if (formValue) { 
                
                if (formValue.length == 5) {

                    let value:string|string[] = mask(formValue, "dateBr").split("-");
                    
                    let dateMoment = moment(value,'HH:mm');
    
                    if (dateMoment?.isValid()) {

                        //Verifica a data é válida de acordo com uma mínima e máxima específicada
                        let minTime = param ? moment(param,'HH:mm') : null;
                        let maxTime = param2 ? moment(param2,'HH:mm') : null;

                        if (minTime && dateMoment.isBefore(minTime)) {
                            return {actual: formValue, message: ("Esse horário deve ser superior às " + minTime.format("HH:mm"))}
                        }

                        if (maxTime && dateMoment.isAfter(maxTime)) {
                            return {actual: formValue, message: ("Esse horário tem que ser inferior às " + maxTime.format("HH:mm"))}
                        }
    
                    } else {
                        return {actual: formValue, message: "Esse horário é inválido."}
                    }

                } else {
                    return {actual: formValue, message: "Esse horário é inválido."}
                }
            }

        }

		return null;

	}

}

/**
 * Inverte uma data
 * Ex: de "2023-07-19" para "19-07-2023"
 * Ex: de "20230719" para "19072023"
 * Ex: de "19-07-2023" para "2023-07-19"
 * Ex: de "19072023" para "20230719"
 * @param value 
 */
export function invertDate(value:string, actualFormat:"br"|"us", actualSeparator?:string|null|undefined, newSeparator?:string|null|undefined) {

    let updatedValue:string = value;

    if (updatedValue && (updatedValue.length == 8 || updatedValue.length == 10)) {

        let day:string = "";
        let month:string = "";
        let year:string = "";

        if (actualFormat == "br") {
    
            if (actualSeparator) {

                let splitValue:string[] = updatedValue.split(actualSeparator);

                day = splitValue[0];
                month = splitValue[1];
                year = splitValue[2];

            } else {
                day = updatedValue[0] + updatedValue[1];
                month = updatedValue[2] + updatedValue[3];
                year = updatedValue.slice(-4);
            }
    
            if (newSeparator) {
                updatedValue = year + newSeparator +  month + newSeparator + day;

            } else {
                updatedValue = year + month + day;
            }

        } else if (actualFormat == "us") {
    
            if (actualSeparator) {

                let splitValue:string[] = updatedValue.split(actualSeparator);

                day = splitValue[2];
                month = splitValue[1];
                year = splitValue[0];

            } else {
                day = updatedValue.slice(-2);
                month = updatedValue[4] + updatedValue[5];
                year = updatedValue[0] + updatedValue[1] + updatedValue[2] + updatedValue[3];
            }
    
            if (newSeparator) {
                updatedValue = day + newSeparator +  month + newSeparator + year;

            } else {
                updatedValue = day + month + year
            }

        }

    }

    return updatedValue;

}

/**
 * Verifica se um determinado CPF é válido
 * @param value
 * @returns boolean
 */
export function isCPFValid(value: string) {
 
	var cpf = value.replace(/[^\d]+/g, '');
 
    if (cpf == '') {
        return false;
    }
 
    var invalidCPFs = [
        "00000000000", "11111111111", "22222222222",
        "33333333333", "44444444444", "55555555555",
        "66666666666", "77777777777", "88888888888",
        "99999999999"
    ];
 
    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 || invalidCPFs.indexOf(cpf) >= 0) {
        return false;
    }
 
    // Valida 1o digito
    var add = 0;
    for (var i = 0; i < 9; i++) {
        add += parseInt(cpf.charAt(i)) * (10 - i);
    }
 
    var rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
        rev = 0;
    }
 
    if (rev != parseInt(cpf.charAt(9))) {
        return false;
    }
 
    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++) {
        add += parseInt(cpf.charAt(i)) * (11 - i);
    }
 
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
        rev = 0;
    }
 
    if (rev != parseInt(cpf.charAt(10))) {
        return false;
    }
 
    return true;
}
 
/**
 * Verifica se um determinado CNPJ é válido
 * @param value
 * @returns boolean
 */
export function isCNPJValid(value: string) {
 
    var cnpj = value.replace(/[^0-9]/g, '');
    var len = cnpj.length - 2;
    var numbers = cnpj.substring(0,len);
    var digits = cnpj.substring(len);
    var add = 0;
    var pos = len - 7;
 
    var invalidCNPJ = [
        '00000000000000',
        '11111111111111',
        '22222222222222',
        '33333333333333',
        '44444444444444',
        '55555555555555',
        '66666666666666',
        '77777777777777',
        '88888888888888',
        '99999999999999'
    ];
 
    if (cnpj.length < 11 || invalidCNPJ.indexOf(cnpj) >= 0) {
        return false;
    }
 
    for (var i = len; i >= 1; i--) {
 
        add = add + parseInt(numbers.charAt(len - i)) * pos--;
 
        if (pos < 2) {
            pos = 9;
        }
    }
 
    var result = (add % 11) < 2 ? 0 : 11 - (add % 11);
 
    if (result.toString() != digits.charAt(0)) {
        return false;
    }
 
    len = len + 1;
    numbers = cnpj.substring(0,len);
    add = 0;
    pos = len - 7;
 
    for (let i = 13; i >= 1; i--) {
 
        add = add + parseInt(numbers.charAt(len - i)) * pos--;
 
        if (pos < 2) {
            pos = 9;
        }
    }
 
    result = (add % 11) < 2 ? 0 : 11 - (add % 11);

    if (result.toString() != digits.charAt(1)) {
        return false;
    }
 
    return true;

}

/**
 * Retorna a string contendo apenas números
 * @param str 
 * @returns 
 */
export function onlyNumbers(str:string|number) {

    str = String(str);

    let numStr:string = str.replace(/[^0-9]/g, "");
    return numStr;

}

/**
 * Obtém uma mensagem personalizada de acordo com o erro especificado
 * @param err 
 * @returns 
 */
export function httpErrMessage(err:any) {

    let message:string = "Tente novamente mais tarde.";
    let timeoutMessage:string = "O tempo limite desta solicitação foi excedido, tente novamente em alguns minutos.";

    if (err && typeof err === 'string') {
        return err == "Timeout has occurred" ? timeoutMessage : err;
        
    } else if (err) {

        if (err.error && err.error.title && typeof err.error.title === 'string') {
            message = err.error.title;

        } else if (err.error && typeof err.error === "string") {
            message = err.error == "Timeout has occurred" ? timeoutMessage : err.error;

        } else if (err.message && typeof err.message == "string" && err.message.length < 100) {
            
            if (err.status !== undefined) {

                if (err.status === 0) {
                    message = "Verifique sua conexão com a internet e tente novamente.";
                    
                } else if (err.status == 401) {
                    message = "Você não possui permissão para essa ação.";
                }

            } else {
                message = err.message == "Timeout has occurred" ? timeoutMessage : err.message;
            }

        } else if (err.statusText) {
    
            if (err.status == 401) {
                message = "Você não possui permissão para essa ação.";

            } else if (err.status == 404) {
                message = "Não foi possível encontrar o que você está procurando, tente novamente mais tarde.";
    
            } else if(err.status == 500) {
                message = "Serviço temporariamente indisponível, tente novamente mais tarde.";

            } else {
                message = err.statusText;
            }

        }

    }

    return message;
}

/**
 * Retorna a string com a máscara aplicada
 * @param val 
 * @param mask 
 * @returns string
 */
export function mask(val:string, mask:string) {
    
    if (mask == "phone") {
        
        if (val.length == 11) {
            mask = "(##) #####-####";

        } else if (val.length == 10) {
            mask = "(##) ####-####";

        } else {
            return val;
        }

    }

    if (mask == "dateBr") {

        if (val.length == 8) {
            mask = "##-##-####";

        } else {
            return val;
        }

    }

    if (mask == "dateUs") {

        if (val.length == 8) {
            mask = "####-##-##";
            
        } else {
            return val;
        }

    }

    if (mask == "doc") {
    
        if (val.length == 14) {
            mask =  val.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5");
        }

        if (val.length == 11) {
            mask = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3\-\$4");
        }
    }


    val = String(val);
    var maskared = '';
    var k = 0;

    for (var i = 0; i <= mask.length - 1; i++) {
        if (mask[i] == '#') {
            if (val[k]) {
                maskared += val[k++];
            }
        } else {
            if (mask[i]) {
                maskared += mask[i];
            }
        }
    }

	return maskared;
}