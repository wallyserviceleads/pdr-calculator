// Initialize PDR Calculator
function initPDRCalculator(config) {
    const calculatorDiv = document.querySelector(config.selector);

    // HTML structure for calculator
    calculatorDiv.innerHTML = `
        <h3>Paintless Dent Repair Estimate</h3>
        <label for="dentSize">Dent Size (in inches):</label>
        <input type="number" id="dentSize" min="1" placeholder="Enter dent size in inches">

        <label>Additional Factors:</label>
        <div>
            <input type="checkbox" id="bodyLine" name="factor" value="25">
            <label for="bodyLine">Body Line</label>

            <input type="checkbox" id="aluminum" name="factor" value="50">
            <label for="aluminum">Aluminum Panel</label>

            <input type="checkbox" id="gluePull" name="factor" value="25">
            <label for="gluePull">Glue Pull</label>
        </div>

        <label for="riOption">R&I for Access (Add $82):</label>
        <input type="checkbox" id="riOption">

        <label for="polishOption">Polishing/Corrosion Protection:</label>
        <input type="checkbox" id="polishOption">

        <button id="calculateBtn">Calculate Estimate</button>
        <div id="result"></div>
    `;

    // Handle calculation
    document.getElementById("calculateBtn").addEventListener("click", function () {
        let basePrice;
        const dentSize = parseInt(document.getElementById("dentSize").value) || 1;
        const factors = document.querySelectorAll('input[name="factor"]:checked');
        let totalPercentage = 0;
        let additionalCost = 0;

        // Set base price based on size (from pricing guide)
        basePrice = getBasePrice(dentSize);

        // Add selected factors
        factors.forEach(factor => {
            totalPercentage += parseInt(factor.value);
        });

        // Add R&I if selected
        if (document.getElementById("riOption").checked) {
            additionalCost += 82;
        }

        // Calculate total estimate
        let estimate = basePrice + (basePrice * (totalPercentage / 100)) + additionalCost;
        let estimateRangeLow = estimate - 50;
        let estimateRangeHigh = estimate + 50;

        document.getElementById("result").innerHTML = `Estimated Range: $${estimateRangeLow.toFixed(2)} - $${estimateRangeHigh.toFixed(2)}`;

        // Send data to CRM if integration enabled
        if (config.crmIntegration && config.crmIntegration === 'highlevel') {
            sendToCRM(config.contactEmail, dentSize, estimateRangeLow, estimateRangeHigh);
        }
    });

    // Function to get base price by dent size
    function getBasePrice(size) {
        const pricing = {
            1: 173.59, 2: 249.18, 3: 324.77, 4: 400.36, 5: 475.95, 
            // Continue as per the full pricing guide
        };
        return pricing[size] || pricing[1];
    }

    // Send data to CRM
    function sendToCRM(email, size, low, high) {
        fetch("https://your-highlevel-webhook-url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                dentSize: size,
                estimateRange: `$${low} - $${high}`
            })
        });
    }
}
