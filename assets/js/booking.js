// Booking Page JavaScript

/**
 * ⚠️ PENTING: GANTI NOMOR WhatsApp DI SINI
 * 
 * Format: Kode Negara + Nomor (tanpa +, tanpa spasi, tanpa tanda hubung)
 * 
 * Contoh Indonesia:
 * - 62895424688302 (nomor Anda mulai dari 0, ganti 0 dengan 62)
 * 
 * Cara mendapatkan nomor:
 * 1. Buka WhatsApp Anda
 * 2. Nomor Anda ada di Settings > Profile
 * 3. Copy nomor lengkap dengan kode negara
 * 
 * JIKA TIDAK DIGANTI, FITUR WhatsApp TIDAK AKAN BEKERJA!
 */
const WHATSAPP_NUMBER = '62895424688302'; // ⚠️ GANTI DENGAN NOMOR ANDA!

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOMContentLoaded event fired!');
    console.log('📍 Window location:', window.location.href);
    console.log('🌳 Document ready state:', document.readyState);
    
    initBookingForm();
    setupDateCalculation();
    setupPriceDisplay();
    setupPaymentSummary();
    loadDataFromService();
    
    console.log('✅ Semua fungsi booking sudah diinitialisasi!');
});

/**
 * Setup price display based on selected car type
 */
function setupPriceDisplay() {
    const carTypeSelect = document.getElementById('carType');
    const priceAmount = document.getElementById('priceAmount');

    if (!carTypeSelect || !priceAmount) return;

    carTypeSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const price = selectedOption.getAttribute('data-price');
        
        if (price) {
            priceAmount.textContent = '$' + parseFloat(price).toFixed(2);
        } else {
            priceAmount.textContent = '$0.00';
        }
        
        // Update payment summary
        updatePaymentSummary();
    });
}

/**
 * Setup payment summary calculation
 */
function setupPaymentSummary() {
    const numberOfDaysInput = document.getElementById('numberOfDays');
    const pickupDateInput = document.getElementById('pickupDate');
    const returnDateInput = document.getElementById('returnDate');
    const carTypeSelect = document.getElementById('carType');

    if (!numberOfDaysInput || !pickupDateInput || !returnDateInput || !carTypeSelect) return;

    // Add event listeners for all inputs
    numberOfDaysInput.addEventListener('change', updatePaymentSummary);
    numberOfDaysInput.addEventListener('input', updatePaymentSummary);
    pickupDateInput.addEventListener('change', updatePaymentSummary);
    returnDateInput.addEventListener('change', updatePaymentSummary);
    carTypeSelect.addEventListener('change', updatePaymentSummary);
}

/**
 * Update payment summary display
 */
function updatePaymentSummary() {
    const carTypeSelect = document.getElementById('carType');
    const numberOfDaysInput = document.getElementById('numberOfDays');
    
    const selectedOption = carTypeSelect.options[carTypeSelect.selectedIndex];
    const pricePerDay = parseFloat(selectedOption.getAttribute('data-price')) || 0;
    const numberOfDays = parseInt(numberOfDaysInput.value) || 0;
    
    // Calculate
    const subtotal = pricePerDay * numberOfDays;
    const discount = subtotal * 0.05; // 5% discount
    const total = subtotal - discount;
    
    // Update summary display
    document.getElementById('summaryDailyRate').textContent = '$' + pricePerDay.toFixed(2);
    document.getElementById('summaryDays').textContent = numberOfDays;
    document.getElementById('summarySubtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('summaryDiscount').textContent = '-$' + discount.toFixed(2);
    document.getElementById('summaryTotal').textContent = '$' + total.toFixed(2);
}

/**
 * Initialize booking form submission
 */
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    
    console.log('🔍 Booking Form Found:', bookingForm);
    
    if (!bookingForm) {
        console.error('❌ ERROR: Form dengan ID "bookingForm" tidak ditemukan!');
        alert('❌ ERROR: Form tidak ditemukan! Silakan refresh halaman.');
        return;
    }

    // Method 1: Form submit event listener
    bookingForm.addEventListener('submit', function(e) {
        console.log('📝 Form submitted via submit event!');
        e.preventDefault();
        handleFormSubmit(bookingForm);
    });

    // Method 2: Button click event listener (backup)
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        console.log('✅ Submit button found:', submitBtn);
        
        submitBtn.addEventListener('click', function(e) {
            console.log('🖱️ Submit button clicked!');
            e.preventDefault();
            
            // Validate form manually
            if (!bookingForm.checkValidity()) {
                console.log('⚠️ Form tidak valid (HTML5 validation)');
                bookingForm.reportValidity();
                return;
            }
            
            handleFormSubmit(bookingForm);
        });
    } else {
        console.error('❌ Submit button tidak ditemukan!');
    }
}

/**
 * Handle form submission logic
 */
function handleFormSubmit(bookingForm) {
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const carType = document.getElementById('carType').value;
    const carTypeLabel = document.getElementById('carType').options[document.getElementById('carType').selectedIndex].text;
    const pickupDate = document.getElementById('pickupDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const pickupTime = document.getElementById('pickupTime').value;
    const numberOfDays = document.getElementById('numberOfDays').value;
    const specialRequirements = document.getElementById('specialRequirements').value.trim();
    const terms = document.getElementById('terms').checked;
    
    // Debug log
    console.log('📋 Form Data:', {
        firstName,
        lastName,
        email,
        phone,
        address,
        carType,
        pickupDate,
        returnDate,
        pickupTime,
        numberOfDays,
        terms
    });
    
    // Validate form
    if (!firstName || !lastName || !email || !phone || !address || !carType || !pickupDate || !returnDate || !pickupTime) {
        console.warn('⚠️ Validasi gagal: Ada field yang kosong');
        alert('⚠️ Mohon isi semua field yang wajib diisi (ditandai dengan *)');
        return;
    }

    if (!terms) {
        console.warn('⚠️ Validasi gagal: Terms tidak disetujui');
        alert('⚠️ Anda harus setuju dengan syarat dan ketentuan');
        return;
    }
    
    // Get price
    const selectedOption = document.getElementById('carType').options[document.getElementById('carType').selectedIndex];
    const pricePerDay = selectedOption.getAttribute('data-price');
    
    console.log('💰 Price Per Day:', pricePerDay);
    
    if (!pricePerDay) {
        console.error('❌ ERROR: Harga tidak ditemukan');
        alert('⚠️ Error: Harga tidak ditemukan. Silakan pilih mobil lagi');
        return;
    }

    const subtotal = (parseFloat(pricePerDay) * parseInt(numberOfDays)).toFixed(2);
    
    console.log('✅ Validasi berhasil! Mengirim ke WhatsApp...');
    
    // Create WhatsApp message
    sendToWhatsApp(
        firstName,
        lastName,
        email,
        phone,
        address,
        carTypeLabel,
        pickupDate,
        returnDate,
        pickupTime,
        numberOfDays,
        pricePerDay,
        subtotal,
        specialRequirements
    );
}

/**
 * Send booking confirmation to WhatsApp
 */
function sendToWhatsApp(firstName, lastName, email, phone, address, carType, pickupDate, returnDate, pickupTime, days, pricePerDay, subtotal, specialRequirements) {
    // Calculate discount and final total
    const discount = (subtotal * 0.05).toFixed(2);
    const finalTotal = (subtotal - discount).toFixed(2);
    
    // Validate WhatsApp number
    if (!WHATSAPP_NUMBER || WHATSAPP_NUMBER === '') {
        alert('❌ Error: WhatsApp number is not configured. Please contact administrator.');
        console.error('WHATSAPP_NUMBER is not set');
        return;
    }
    
    // Format message for WhatsApp
    const message = `Hello, I would like to confirm my car rental booking:

*PERSONAL INFORMATION*
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Address: ${address}

*BOOKING DETAILS*
Car Type: ${carType}
Pickup Date: ${formatDate(pickupDate)}
Pickup Time: ${pickupTime}
Return Date: ${formatDate(returnDate)}
Number of Days: ${days} days

*PAYMENT SUMMARY*
Price per Day: $${parseFloat(pricePerDay).toFixed(2)}
Subtotal: $${parseFloat(subtotal).toFixed(2)}
Discount (5%): -$${parseFloat(discount).toFixed(2)}
Total Payment: $${parseFloat(finalTotal).toFixed(2)}

${specialRequirements ? `*Special Requirements:*
${specialRequirements}` : ''}

Thank you!`;

    console.log('Booking Message:', message);
    console.log('WhatsApp Number:', WHATSAPP_NUMBER);
    
    try {
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Create WhatsApp link
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        console.log('Opening WhatsApp URL:', whatsappURL);
        
        // Open WhatsApp in new window
        const whatsappWindow = window.open(whatsappURL, '_blank');
        
        if (!whatsappWindow) {
            alert('❌ Popup blocked! Please allow popups and try again.');
            return;
        }
        
        // Show confirmation message
        setTimeout(() => {
            showBookingConfirmation(firstName, finalTotal);
        }, 500);
        
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        alert('❌ Error: ' + error.message);
    }
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

/**
 * Show booking confirmation message
 */
function showBookingConfirmation(firstName, totalPrice) {
    const confirmMessage = `✅ Thank You ${firstName}!\n\n📱 Your booking has been sent to our WhatsApp.\n\n💰 Total Payment: $${parseFloat(totalPrice).toFixed(2)}\n\n⏳ Our team will respond shortly.\n\nHave any questions? Our team is ready to help!`;
    alert(confirmMessage);
    
    // Reset form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.reset();
    }
    
    const numberOfDaysInput = document.getElementById('numberOfDays');
    if (numberOfDaysInput) {
        numberOfDaysInput.value = '1';
    }
    
    const priceAmountSpan = document.getElementById('priceAmount');
    if (priceAmountSpan) {
        priceAmountSpan.textContent = '$0.00';
    }
    
    // Reset payment summary
    document.getElementById('summaryDailyRate').textContent = '$0.00';
    document.getElementById('summaryDays').textContent = '0';
    document.getElementById('summarySubtotal').textContent = '$0.00';
    document.getElementById('summaryDiscount').textContent = '-$0.00';
    document.getElementById('summaryTotal').textContent = '$0.00';
}

/**
 * Setup automatic date calculation
 */
function setupDateCalculation() {
    const pickupDate = document.getElementById('pickupDate');
    const returnDate = document.getElementById('returnDate');
    const numberOfDays = document.getElementById('numberOfDays');

    if (!pickupDate || !returnDate || !numberOfDays) return;

    function calculateDays() {
        if (pickupDate.value && returnDate.value) {
            const pickup = new Date(pickupDate.value);
            const returnD = new Date(returnDate.value);
            
            // Calculate difference in milliseconds and convert to days
            const diffTime = returnD - pickup;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Ensure minimum 1 day
            numberOfDays.value = Math.max(1, diffDays);
            
            // Validate dates
            if (returnD < pickup) {
                alert('Tanggal return harus lebih besar dari tanggal pickup');
                returnDate.value = '';
                numberOfDays.value = '1';
            }
        }
    }

    pickupDate.addEventListener('change', calculateDays);
    returnDate.addEventListener('change', calculateDays);
}

/**
 * Setup hamburger menu functionality
 */
/**
 * Load data from service section if booking from there
 */
function loadDataFromService() {
    const params = new URLSearchParams(window.location.search);
    const carType = params.get('carType');
    const carName = params.get('carName');
    const price = params.get('price');

    if (carType && carName && price) {
        // Set car type select value
        const carTypeSelect = document.getElementById('carType');
        const optionToSelect = Array.from(carTypeSelect.options).find(option => 
            option.value === carType
        );
        
        if (optionToSelect) {
            optionToSelect.selected = true;
            carTypeSelect.dispatchEvent(new Event('change'));
            updatePaymentSummary();
        }
    }
}
