/**
 * index.js - Frontend Logic for AI Researcher
 */

// --- 1. COOKIE UTILITIES ---
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

// --- 2. UI HELPERS ---
const btn = document.getElementById('submitBtn');
const statusBox = document.getElementById('statusBox');

function updateStatus(msg, bootstrapClass) {
    statusBox.innerHTML = msg;
    statusBox.className = `alert mt-4 text-center ${bootstrapClass}`;
    statusBox.style.display = "block";
}

// --- 3. MAIN EVENT LISTENER ---
btn.addEventListener('click', async () => {
    const emailInput = document.getElementById('email');
    const textInput = document.getElementById('textInput');
    
    const email = emailInput.value.trim();
    const text = textInput.value.trim();

    // 1. Validation (User side)
    if (!email || !text) {
        updateStatus("Please enter both your email and the content you want to analyze.", "alert-warning");
        return;
    }

    // 2. Session Management
    let sessionId = getCookie("session_id");
    if (!sessionId) {
        sessionId = "id_" + Math.random().toString(36).substring(2, 11);
        setCookie("session_id", sessionId, 7);
    }

    // 3. UI Loading State
    btn.disabled = true;
    const originalBtnText = btn.innerText;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    statusBox.style.display = "none";

    try {
        // 4. API Call
        await axios.post('http://127.0.0.1:8000/analyze', {
            email: email,
            text: text,
            session_id: sessionId
        });

        // 5. Handle Success
        updateStatus("<strong>Success!</strong> Your request was received. We'll send the results to your email shortly.", "alert-success");
        emailInput.value = "";
        textInput.value = "";

    } catch (error) {
        // 6. User-Friendly Error Translation
        let friendlyMsg = "Something went wrong on our end. Please try again in a moment.";

        if (!error.response) {
            // No response usually means the server/backend isn't running
            friendlyMsg = "We're having trouble connecting to the server. Please check your internet or try again later.";
        } else if (error.response.status === 429) {
            friendlyMsg = "You've sent too many requests. Please wait a few minutes before trying again.";
        } else if (error.response.status === 400) {
            friendlyMsg = "The information provided seems incorrect. Please double-check your email and text.";
        } else if (error.response.status >= 500) {
            friendlyMsg = "Our AI service is currently busy or undergoing maintenance. Please try again later.";
        }

        console.error("System Error Details:", error); // Dev can still see the real error in console
        updateStatus(`<strong>Notice:</strong> ${friendlyMsg}`, "alert-danger");
        
    } finally {
        btn.disabled = false;
        btn.innerText = originalBtnText;
    }
});