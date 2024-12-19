// Function to handle microphone input and detect blowing sound
function startMicDetection() {
    // Check if the browser supports audio
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                const microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                
                function detectBlow() {
                    analyser.getByteFrequencyData(dataArray);

                    // Calculate the average sound level (volume)
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    const average = sum / bufferLength;

                    // Check if average sound level exceeds a threshold
                    if (average > 100) { // Adjust threshold as needed
                        // If the sound level is high (blow), unlit the candle
                        document.querySelector('.flame').classList.add('unlit');
                        
                        // Add a fade-out animation before navigating to afterblow.html
                        document.body.style.transition = "opacity 1s ease-out";
                        document.body.style.opacity = 0;
                        
                        // After the transition, load afterblow.html
                        setTimeout(function() {
                            window.location.href = "afterblow.html";
                        }, 1000); // Match the timeout duration to the transition time
                    }

                    requestAnimationFrame(detectBlow); // Keep checking the sound
                }

                detectBlow();
            })
            .catch(function(err) {
                console.log('Error accessing microphone: ', err);
            });
    } else {
        alert('Your browser does not support audio input.');
    }
}

// Start the microphone detection when the page loads
window.onload = startMicDetection;
