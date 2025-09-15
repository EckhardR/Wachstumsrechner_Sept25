export const globalFetchDataOhneLoading = async (
    variable,
    setVariable,
    requestFunction,
    setError,
    forceUpdate
) => {
    if (!variable || variable.length < 1 || forceUpdate) {
        try {
            const response = await requestFunction().catch( (error) => {                
                setError(() => {
                    return error
                });
                return;
            });
            if(response && response.data){
                setVariable(response.data);
            }
        } catch (error) {
            console.error(error);
            setError(error);
        }
    }
};

export const globalFetchDataV1 = async (
    variable,
    setVariable,
    requestFunction,
    setIsLoading,
    setError,
    forceUpdate
) => {
    if (!variable || variable.length < 1 || forceUpdate) {
        try {
            setIsLoading(true);
            const response = await requestFunction().catch( (error) => {  
                setError(() => {
                    setIsLoading(false);
                    return error
                });
                setIsLoading(false);
                return;
            });
            if(response && response.data){
                setVariable(response.data);
            }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setError(error);
        }
    }
};

export const globalFetchDataV2 = async (
    variable,
    setVariable,
    requestFunction,
    setIsLoading,
    setSecondData,
    setError,
    forceUpdate
) => {
    if (!variable || variable.length < 1 || forceUpdate) {
        try {
            setIsLoading(true);
            const response = await requestFunction().catch( (error) => {                
                setError(() => {
                    setIsLoading(false);
                    return error
                });
                setIsLoading(false);
                return;
            });    
            
            if(response && response.data){
                setVariable(response.data);
                if (setSecondData) setSecondData(response.data);
            }
            
            setIsLoading(false);
        } catch (error) {
            
            setError(error);
        }
    }
};

export const globalHandleSearch = (
    setData,
    fetchedData,
    targetAttribute,
    searchValue,
    sourceTruth
) => {
    
    if (searchValue === null || searchValue === undefined){
        setData(sourceTruth)
    } else {
        const filteredData = fetchedData?.filter((element) => {
            return String(element[targetAttribute]) === String(searchValue)
        }); 
        setData(filteredData);
    }
};

export const globalHandleSearchSecondAttribute = (
    setData,
    sourceTruth,
    targetAttribute,
    targetAttribute2,
    searchValue
) => {
    if (searchValue === null) setData(sourceTruth);
    else {
        const filteredData = sourceTruth.filter(function (element) {
            return element[targetAttribute][targetAttribute2].includes(searchValue);
        });
        setData(filteredData);
    }
};

export function globalAutocompleteArray(sourceTruth, targetAttribute, secondAttribute) {
    if (sourceTruth) {
        const set = new Set(sourceTruth.map((record) => {
            return !secondAttribute ? String(record[targetAttribute]) : String(record[targetAttribute]) + ' ' + String(record[secondAttribute])
        }));
        if (set.has(null)) {
            set.delete(null);
        }
        return [...set];
        
    } else return [];
}

export function globalAutocompleteOptionsLabel(sourceTruth, optionsAttribute, labelAttribute) {
    if (sourceTruth) {
        const set = new Set(sourceTruth.map((record) => {
            return {id: record[optionsAttribute], label: String(record[labelAttribute])}
        }));
        if (set.has(null)) {
            set.delete(null);
        }
        return [...set];
        
    } else return [];
}

export function globalAutocompleteArrayFromTwoAttributes(
    sourceTruth,
    AttributeOne,
    AttributeTwo
) {
    if (sourceTruth) {
        const firstSet = new Set(sourceTruth.map((record) => record[AttributeOne]));
        const secondSet = new Set(
            sourceTruth.map((record) => record[AttributeTwo])
        );
        const set = new Set([...firstSet, ...secondSet]);
        if (set.has(null))
            set.delete(null);
        if (set.has('null'))
            set.delete('s');
        return [...set];
    } else return [];
}

export function globalAutocompleteArraySecondAttribute(
    sourceTruth,
    targetAttribute,
    targetAttribute2
) {
    //console.log(sourceTruth, targetAttribute, targetAttribute2);
    if (sourceTruth) {
        const set = new Set(
            sourceTruth.map((record) => {
                if (record[targetAttribute]) {
                    return record[targetAttribute][targetAttribute2];
                }
                return null;
            })
        );
        //console.log(set);
        if (set.has(null)) {
            set.delete(null);
        }
        return [...set.values()];
    } else return [];
}

export const isSelectedGlobal = (element, selectedData) =>
    selectedData.some((item) => item === element);

export function reducer(state, action) {
    switch (action.type) {
        case "increment":
            return state + 1;
        default:
            throw new Error("Invalid action type");
    }
}

export const getUserName = () => {
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).Username : 'none';
}

export const getClinicum = () => {
    return localStorage.getItem('clinicum') ? localStorage.getItem('clinicum') : null;
}
export const getStation = () => {
    return localStorage.getItem('station') ? localStorage.getItem('station') : null;
}

export const replaceGermanChars = (inputString) => {
    const replacements = {
        'ä': 'ae',
        'ö': 'oe',
        'ü': 'ue',
        'Ä': 'Ae',
        'Ö': 'Oe',
        'Ü': 'Ue',
        'ß': 'ss'
    };

    let outputString = inputString;
    for (const [char, replacement] of Object.entries(replacements)) {
        outputString = outputString.replace(new RegExp(char, 'g'), replacement);
    }
    return outputString;
}
