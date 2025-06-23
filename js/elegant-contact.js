// Elegant Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const result = document.getElementById('result');
    const submitButton = form.querySelector('button[type="submit"]');

    // Form validation and submission handling
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const isValid = validateForm();

        if (isValid) {
            // Show submitting status
            submitButton.classList.add('loading');
            result.innerHTML = "Submitting...";
            result.className = "";
            result.style.opacity = "1";

            const formData = new FormData(form);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.innerHTML = json.message;
                    result.classList.add('success');
                    form.reset();
                    form.querySelectorAll('input, textarea').forEach(field => {
                        field.classList.remove('invalid', 'valid');
                    });
                } else {
                    console.log(response);
                    result.innerHTML = json.message;
                    result.classList.add('error');
                }
            })
            .catch(error => {
                console.log(error);
                result.innerHTML = "Something went wrong!";
                result.classList.add('error');
            })
            .finally(() => {
                submitButton.classList.remove('loading');
                setTimeout(() => {
                    result.style.opacity = "0";
                }, 5000);
            });
        }
    });

    function validateForm() {
        let isValid = true;
        form.querySelectorAll('input[required], textarea[required]').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }
    
    // Helper function to mark field as invalid
    function markInvalid(field, feedbackClass) {
        field.classList.remove('valid');
        field.classList.add('invalid');
        // Hide all error messages first
        field.closest('div').querySelectorAll('.error-message').forEach(msg => msg.classList.remove('show'));
        // Show the specific error message
        if (feedbackClass) {
            field.closest('div').querySelector(`.${feedbackClass}`).classList.add('show');
        }
    }

    // Helper function to mark field as valid
    function markValid(field) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        field.closest('div').querySelectorAll('.error-message').forEach(msg => {
            msg.classList.remove('show');
        });
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Add focus and blur event listeners for enhanced UX
    form.querySelectorAll('input, textarea').forEach(field => {
        // Clear validation on focus
        field.addEventListener('focus', () => {
            field.classList.remove('invalid');
            field.closest('div').querySelectorAll('.error-message').forEach(msg => {
                msg.classList.remove('show');
            });
        });
        
        // Validate on blur for immediate feedback
        field.addEventListener('blur', () => {
            validateField(field);
        });
    });
});
