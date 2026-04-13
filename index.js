[
    '/usr/bin/node',
    '/home/Thandolwethu/cargo-validator-cli/',
    'manifest.json'
]

const filePath = process.argv[2];
console.log(filePath);

const fs = require("fs");
const data = fs.readFileSync(filePath, 'utf-8');
console.log(data);

const manifestObj = JSON.parse(data);

function validateProperties(manifest) {
    const errors = {};
    let totalWeight = 0;

    //validating containerId
    if (!manifest.containerId) {
        errors.containerId = "Missing";
    } else if (typeof manifest.containerId !== "string") {
        errors.containerId = "Invalid";
    };

    //validating cargo
    if (!manifest.cargo) {
        errors.cargo = "Missing";
    } else if (!Array.isArray(manifest.cargo)) {
        errors.cargo = "Invalid";
    } else {

        //Validating cargo array properties
            errors.cargo = [];

            for (let i = 0; i < manifest.cargo.length; i++) {

                const item = manifest.cargo[i];
                let itemErrors = {};
                if (typeof manifest.cargo[i] !== "object" || manifest.cargo[i] === null) {
                    itemErrors.item = "Invalid";
                    errors.cargo[i] = itemErrors;

                    continue;
                } else {
                    if (!manifest.cargo[i].name) {
                        itemErrors.name = "Missing";
                    } else if (
                        typeof manifest.cargo[i].name !== "string"
                    ) {
                        itemErrors.name = "Invalid";
                    };

                    if (manifest.cargo[i].weight === undefined || manifest.cargo[i].weight === null) {
                        itemErrors.weight = "Missing";
                    } else if (
                        typeof manifest.cargo[i].weight !== "number" ||
                        manifest.cargo[i].weight < 0 ||
                        manifest.cargo[i].weight === null
                    ) {
                        itemErrors.weight = "Invalid";
                    };

                    if (Object.keys(itemErrors).length > 0) {
                        errors.cargo[i] = itemErrors;
                    }
                    console.log("item:", manifestObj.cargo[i]);
                }
        };

             const hasCargoErrors = errors.cargo.some(item => item !== undefined);

             if (!hasCargoErrors) {
                delete errors.cargo;
             };
 
         //Calculating weight

            if (Array.isArray(errors.cargo) && !hasCargoErrors) {
            for (item of manifest.cargo) {
                totalWeight += item.weight;
            };
        };


        //Validating unit
        if (!manifest.unit) {
            errors.unit = "Missing";
        } else if (manifest.unit !== "kg" && manifest.unit !== "lb") {
            errors.unit = "Invalid";
        };
    }
    return { errors, totalWeight };
}

const result = validateProperties(manifestObj);

if (Object.keys(result.errors).length === 0) {
    console.log("Manifest is valid");
} else {
    console.log("Manifest is invalid");
    console.log(JSON.stringify(result.errors, null, 2));
}

