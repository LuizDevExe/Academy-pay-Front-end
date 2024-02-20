const CryptoJS = require("crypto-js");

const secretKey = "chave-secreta-para-a-criptografia";

function encryptAndStore(key, value) {
  const encryptedValue = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    secretKey
  ).toString();
  localStorage.setItem(key, encryptedValue);
}

function retrieveAndDecrypt(key) {
  try {
    const encryptedValue = localStorage.getItem(key);

    if (encryptedValue) {
      const decryptedValue = CryptoJS.AES.decrypt(
        encryptedValue,
        secretKey
      ).toString(CryptoJS.enc.Utf8);

      if (!decryptedValue) {
        console.error("A descriptografia não resultou em uma string válida.");
        return null;
      }

      return JSON.parse(decryptedValue);
    }

    return null;
  } catch (error) {
    console.error("Erro ao descriptografar dados:", error);
    return null;
  }
}

// //encriptar
// const dataToEncrypt = { sensitiveData: 'This is secret!' };
// encryptAndStore('secureData', dataToEncrypt);

// //decriptar
// const decryptedData = retrieveAndDecrypt('secureData');
// console.log(decryptedData);

function removeItem(key) {
  localStorage.removeItem(key);
}

function clearAll() {
  localStorage.clear();
}

function cpfMask(cpf) {
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(
    9
  )}`;
}

function phoneMask(phoneNumber) {
  const cleanedNumber = phoneNumber.replace(/\D/g, "");

  const formattedNumber = cleanedNumber.replace(
    /(\d{2})(\d{5})(\d{4})/,
    "($1)  $2-$3"
  );

  return formattedNumber;
}

function formatCurrency(value) {
  let valueRS = value / 100;

  let valueFormat = valueRS.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  return valueFormat;
}

function formatDate(date) {
  return new Date(date).toLocaleString("pt-br", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

module.exports = {
  encryptAndStore,
  retrieveAndDecrypt,
  removeItem,
  clearAll,
  cpfMask,
  phoneMask,
  formatCurrency,
  formatDate,
};
