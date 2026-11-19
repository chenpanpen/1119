const form = document.getElementById("payment-form");
const cardInput = document.getElementById("card-number");
const expiryInput = document.getElementById("expiry");
const cvvInput = document.getElementById("cvv");
const amountInput = document.getElementById("amount");
const result = document.getElementById("result");

// 1. 基礎檢查與錯誤顯示工具
function isEmpty(value) {
  return value.trim() === "";
}

function containsDigitsOnly(value) {
  return /^\d+$/.test(value);
}

function hasLength(value, length) {
  return value.length === length;
}

function showFieldError(input, text) {
  const field = input.closest(".field");
  const error = field.querySelector(".error");
  field.classList.add("invalid");
  error.textContent = text;
}

function clearErrors() {
  document.querySelectorAll(".field").forEach(function (field) {
    field.classList.remove("invalid");
    field.querySelector(".error").textContent = "";
  });
  result.textContent = "";
  result.classList.remove("success");
}

// 2. Luhn 檢查碼演算法
function passesLuhn(cardNumber) {
  const digits = cardNumber.replace(/\s/g, "");
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);

    if (shouldDouble) {
      digit = digit * 2;
      if (digit > 9) {
        digit = digit - 9;
      }
    }

    sum = sum + digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// 3. 各欄位獨立驗證函式
function validateCardNumber() {
  const rawCardNumber = cardInput.value;
  if (isEmpty(rawCardNumber)) {
    showFieldError(cardInput, "請輸入測試卡號");
    return false;
  }

  const digits = rawCardNumber.trim().replace(/\s/g, "");
  if (!containsDigitsOnly(digits)) {
    showFieldError(cardInput, "卡號只能包含數字與空白");
    return false;
  }

  if (!hasLength(digits, 16)) {
    showFieldError(cardInput, "測試卡號必須是 16 位數");
    return false;
  }

  if (!passesLuhn(digits)) {
    showFieldError(cardInput, "卡號檢查碼不正確");
    return false;
  }

  return true;
}

function validateExpiry() {
  const value = expiryInput.value.trim();
  if (isEmpty(value)) {
    showFieldError(expiryInput, "請輸入有效期限");
    return false;
  }

  const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) {
    showFieldError(expiryInput, "格式需為 MM/YY，月份介於 01 到 12");
    return false;
  }

  const month = Number(match[1]);
  const year = Number(match[2]);
  if (month < 1 || month > 12 || year < 26) {
    showFieldError(expiryInput, "有效期限不正確或已過期（年份需 >= 26）");
    return false;
  }

  return true;
}

function validateCvv() {
  const value = cvvInput.value.trim();
  if (isEmpty(value)) {
    showFieldError(cvvInput, "請輸入安全碼");
    return false;
  }

  if (!/^\d{3}$/.test(value)) {
    showFieldError(cvvInput, "安全碼必須是 3 位數字");
    return false;
  }

  return true;
}

function validateAmount() {
  if (isEmpty(amountInput.value)) {
    showFieldError(amountInput, "請輸入金額");
    return false;
  }

  const amount = Number(amountInput.value);
  if (!Number.isFinite(amount)) {
    showFieldError(amountInput, "請輸入有效金額");
    return false;
  } else if (amount < 1 || amount > 50000) {
    showFieldError(amountInput, "金額必須介於 1 到 50000");
    return false;
  }

  return true;
}

// 4. 表單送出事件
form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  const cardOK = validateCardNumber();
  const expiryOK = validateExpiry();
  const cvvOK = validateCvv();
  const amountOK = validateAmount();

  if (cardOK && expiryOK && cvvOK && amountOK) {
    result.textContent = "欄位檢查完成，測試交易通過";
    result.classList.add("success");
  }
});