/* 
    File: script.js
    Smart DocOps Agent - Interactive AI Demo with Animations
    Simulates AI-powered document processing with intelligent workflows
*/

// Demo Data - Sample Documents
const demoDocuments = [
    {
        type: 'invoice',
        supplier: 'TechSupply Corp',
        poNumber: 'PO-2024-1847',
        invoiceNumber: 'INV-90234',
        amount: 45230.50,
        items: [
            { sku: 'SKU-4521', description: 'Server Components', qty: 50, unitCost: 450.30 },
            { sku: 'SKU-7834', description: 'Network Cables', qty: 200, unitCost: 15.75 }
        ],
        paymentTerms: 'Net 30',
        rebate: 2.5,
        status: 'matched',
        confidence: 98.5
    },
    {
        type: 'invoice',
        supplier: 'GlobalParts Inc',
        poNumber: 'PO-2024-1852',
        invoiceNumber: 'INV-90241',
        amount: 28750.00,
        items: [
            { sku: 'SKU-2341', description: 'Industrial Motors', qty: 25, unitCost: 1150.00 }
        ],
        paymentTerms: 'Net 15',
        rebate: 3.0,
        status: 'earlypay',
        confidence: 99.2,
        earlyPaySavings: 862.50
    },
    {
        type: 'invoice',
        supplier: 'MegaSupply Ltd',
        poNumber: 'PO-2024-1848',
        invoiceNumber: 'INV-90235',
        amount: 52100.00,
        expectedAmount: 48900.00,
        items: [
            { sku: 'SKU-8821', description: 'Hydraulic Parts', qty: 120, unitCost: 434.17 }
        ],
        paymentTerms: 'Net 30',
        status: 'mismatch',
        confidence: 95.1,
        discrepancy: 3200.00,
        discrepancyType: 'overbilling'
    },
    {
        type: 'invoice',
        supplier: 'TechSupply Corp',
        poNumber: 'PO-2024-1847',
        invoiceNumber: 'INV-90236',
        amount: 45230.50,
        items: [
            { sku: 'SKU-4521', description: 'Server Components', qty: 50, unitCost: 450.30 }
        ],
        paymentTerms: 'Net 30',
        status: 'duplicate',
        confidence: 99.8,
        originalInvoice: 'INV-90234'
    },
    {
        type: 'credit_memo',
        supplier: 'GlobalParts Inc',
        poNumber: 'PO-2024-1820',
        creditNumber: 'CM-10045',
        amount: -5420.00,
        reason: 'Defective items returned',
        status: 'matched',
        confidence: 97.3
    },
    {
        type: 'asn',
        supplier: 'LogiSupply Co',
        poNumber: 'PO-2024-1855',
        asnNumber: 'ASN-78432',
        expectedDelivery: '2025-11-05',
        items: [
            { sku: 'SKU-9912', description: 'Safety Equipment', qty: 150 }
        ],
        status: 'matched',
        confidence: 96.8
    }
];

// AI Insights Data
const aiInsights = [
    {
        icon: '⚠️',
        title: 'Supplier Performance Alert',
        description: 'MegaSupply Ltd has a <span class="insight-highlight">12% mismatch rate</span> over the last 30 days. Recommend supplier review meeting.'
    },
    {
        icon: '💰',
        title: 'Early Payment Opportunities',
        description: '<span class="insight-highlight">$1.1M in potential early-pay discounts</span> available this month across 14 suppliers.'
    },
    {
        icon: '🔄',
        title: 'Duplicate Invoice Detection',
        description: 'Detected <span class="insight-highlight">8 duplicate invoices</span> totaling $14,650 in potential overpayment risk.'
    },
    {
        icon: '📈',
        title: 'Processing Efficiency',
        description: 'AI agent processed 847 documents this week with <span class="insight-highlight">97.8% accuracy</span>, saving 42 hours of manual review.'
    },
    {
        icon: '🎯',
        title: 'Cost Optimization',
        description: 'Identified <span class="insight-highlight">$87,450 in cost savings</span> through price variance analysis and rebate optimization.'
    },
    {
        icon: '🤖',
        title: 'Learning Progress',
        description: 'Agent confidence improved by <span class="insight-highlight">15.2%</span> through reinforcement learning from 1,200+ user corrections.'
    }
];

// Global Variables
let processedCount = 0;
let matchedCount = 0;
let totalSavings = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    animateStatsOnLoad();
});

// Event Listeners
function initializeEventListeners() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const processDemoBtn = document.getElementById('processDemoBtn');

    // Upload area click
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#146eb4';
        uploadArea.style.background = '#f0f7fc';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#4daae8';
        uploadArea.style.background = '#f8fbfe';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#4daae8';
        uploadArea.style.background = '#f8fbfe';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processDocuments();
        }
    });

    // Process demo button
    processDemoBtn.addEventListener('click', () => {
        processDocuments();
    });

    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Animate stats on page load
function animateStatsOnLoad() {
    animateCounter('docsProcessed', 0, 847, 2000);
    animateCounter('matchRate', 0, 97.8, 2000, '%');
    animateCounter('savingsAmount', 0, 187450, 2000, '$');
    animateCounter('processingTime', 0, 2.3, 2000, 's');
}

// Counter animation
function animateCounter(elementId, start, end, duration, prefix = '') {
    const element = document.getElementById(elementId);
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = start + (end - start) * easeOutQuad(progress);
        
        if (prefix === '$') {
            element.textContent = `$${Math.floor(currentValue).toLocaleString()}`;
        } else if (prefix === '%') {
            element.textContent = `${currentValue.toFixed(1)}%`;
        } else if (prefix === 's') {
            element.textContent = `${currentValue.toFixed(1)}s`;
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Easing function
function easeOutQuad(t) {
    return t * (2 - t);
}

// Process Documents - Main AI Workflow
async function processDocuments() {
    showProcessingModal();
    
    // Step 1: Ingest + Extract
    await simulateStep(1, 'Ingesting documents...', 'OCR + LLM extraction in progress', 1500);
    await animateExtraction();
    
    // Step 2: Validate + Match
    await simulateStep(2, 'Validating data...', 'Running 3-way match logic', 2000);
    
    // Step 3: Classify + Act
    await simulateStep(3, 'Classifying documents...', 'AI agent making decisions', 1800);
    
    // Step 4: Insight Generation
    await simulateStep(4, 'Generating insights...', 'Analyzing supplier patterns', 1500);
    
    hideProcessingModal();
    displayResults();
    displayInsights();
    updateStats();
}

// Simulate workflow step
async function simulateStep(stepNumber, title, subtitle, duration) {
    return new Promise((resolve) => {
        const step = document.querySelector(`[data-step="${stepNumber}"]`);
        const status = document.getElementById(`step${stepNumber}-status`);
        
        // Activate step
        step.classList.add('active');
        status.textContent = 'Processing...';
        
        // Update modal
        document.getElementById('processingText').textContent = title;
        document.getElementById('processingSubtext').textContent = subtitle;
        
        // Update progress
        const progress = (stepNumber / 4) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        
        // Complete step after duration
        setTimeout(() => {
            status.textContent = 'Complete ✓';
            
            // Deactivate after short delay
            setTimeout(() => {
                if (stepNumber < 4) {
                    step.classList.remove('active');
                }
            }, 500);
            
            resolve();
        }, duration);
    });
}

// Animate extraction display
async function animateExtraction() {
    const display = document.getElementById('extractionDisplay');
    display.innerHTML = '';
    
    const extractionFields = [
        { label: 'Document Type', value: 'Invoice', icon: '📄' },
        { label: 'Supplier', value: 'TechSupply Corp', icon: '🏢' },
        { label: 'PO Number', value: 'PO-2024-1847', icon: '🔢' },
        { label: 'Amount', value: '$45,230.50', icon: '💰' },
        { label: 'Payment Terms', value: 'Net 30', icon: '📅' },
        { label: 'Confidence', value: '98.5%', icon: '✓' }
    ];
    
    for (let i = 0; i < extractionFields.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const field = extractionFields[i];
        const fieldEl = document.createElement('div');
        fieldEl.style.cssText = 'padding: 12px; margin-bottom: 10px; background: white; border-radius: 6px; border-left: 3px solid #4daae8; animation: slideInLeft 0.3s ease-out;';
        fieldEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #666; font-weight: 500;">
                    <span style="margin-right: 8px;">${field.icon}</span>${field.label}
                </span>
                <span style="color: #146eb4; font-weight: 600;">${field.value}</span>
            </div>
        `;
        display.appendChild(fieldEl);
    }
}

// Display Results
function displayResults() {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    
    // Show matched tab by default
    switchTab('matched');
}

// Switch between result tabs
function switchTab(tab) {
    const content = document.getElementById('resultsContent');
    content.innerHTML = '';
    
    const filtered = demoDocuments.filter(doc => doc.status === tab);
    
    if (filtered.length === 0) {
        content.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>No documents in this category</p></div>';
        return;
    }
    
    filtered.forEach((doc, index) => {
        setTimeout(() => {
            const item = createResultItem(doc);
            content.appendChild(item);
        }, index * 150);
    });
}

// Create result item element
function createResultItem(doc) {
    const item = document.createElement('div');
    item.className = `result-item ${doc.status}`;
    
    let badge = '';
    let badgeClass = '';
    
    switch(doc.status) {
        case 'matched':
            badge = 'Matched ✓';
            badgeClass = 'badge-success';
            break;
        case 'mismatch':
            badge = 'Mismatch ⚠';
            badgeClass = 'badge-warning';
            break;
        case 'earlypay':
            badge = 'Early Pay 💰';
            badgeClass = 'badge-info';
            break;
        case 'duplicate':
            badge = 'Duplicate 🔄';
            badgeClass = 'badge-danger';
            break;
    }
    
    let detailsHTML = `
        <div class="detail-item">
            <span class="detail-label">Supplier:</span>
            <span class="detail-value">${doc.supplier}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">PO Number:</span>
            <span class="detail-value">${doc.poNumber}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Amount:</span>
            <span class="detail-value">$${doc.amount.toLocaleString()}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Confidence:</span>
            <span class="detail-value">${doc.confidence}%</span>
        </div>
    `;
    
    if (doc.status === 'mismatch') {
        detailsHTML += `
            <div class="detail-item">
                <span class="detail-label">Expected:</span>
                <span class="detail-value">$${doc.expectedAmount.toLocaleString()}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Discrepancy:</span>
                <span class="detail-value" style="color: #ff9900;">+$${doc.discrepancy.toLocaleString()}</span>
            </div>
        `;
    }
    
    if (doc.status === 'earlypay') {
        detailsHTML += `
            <div class="detail-item">
                <span class="detail-label">Rebate:</span>
                <span class="detail-value">${doc.rebate}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Potential Savings:</span>
                <span class="detail-value" style="color: #28a745;">$${doc.earlyPaySavings.toLocaleString()}</span>
            </div>
        `;
    }
    
    if (doc.status === 'duplicate') {
        detailsHTML += `
            <div class="detail-item">
                <span class="detail-label">Original Invoice:</span>
                <span class="detail-value">${doc.originalInvoice}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Risk Amount:</span>
                <span class="detail-value" style="color: #dc3545;">$${doc.amount.toLocaleString()}</span>
            </div>
        `;
    }
    
    item.innerHTML = `
        <div class="result-header">
            <div class="result-title">${doc.type.toUpperCase()} - ${doc.invoiceNumber || doc.creditNumber || doc.asnNumber}</div>
            <div class="result-badge ${badgeClass}">${badge}</div>
        </div>
        <div class="result-details">
            ${detailsHTML}
        </div>
    `;
    
    return item;
}

// Display AI Insights
function displayInsights() {
    const insightsSection = document.getElementById('insightsSection');
    const insightsGrid = document.getElementById('insightsGrid');
    
    insightsSection.style.display = 'block';
    insightsGrid.innerHTML = '';
    
    aiInsights.forEach((insight, index) => {
        setTimeout(() => {
            const card = document.createElement('div');
            card.className = 'insight-card';
            card.innerHTML = `
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-title">${insight.title}</div>
                <div class="insight-description">${insight.description}</div>
            `;
            insightsGrid.appendChild(card);
        }, index * 200);
    });
}

// Update Stats
function updateStats() {
    // Calculate new stats based on processed documents
    const newProcessed = 847 + demoDocuments.length;
    const newMatched = demoDocuments.filter(d => d.status === 'matched').length;
    const newSavings = demoDocuments
        .filter(d => d.earlyPaySavings)
        .reduce((sum, d) => sum + d.earlyPaySavings, 0);
    
    const matchRate = ((newMatched / demoDocuments.length) * 100).toFixed(1);
    
    animateCounter('docsProcessed', 847, newProcessed, 1000);
    animateCounter('matchRate', 97.8, parseFloat(matchRate), 1000, '%');
    animateCounter('savingsAmount', 187450, 187450 + newSavings, 1000, '$');
}

// Show Processing Modal
function showProcessingModal() {
    const modal = document.getElementById('processingModal');
    modal.classList.add('show');
    document.getElementById('progressFill').style.width = '0%';
}

// Hide Processing Modal
function hideProcessingModal() {
    setTimeout(() => {
        const modal = document.getElementById('processingModal');
        modal.classList.remove('show');
        
        // Reset all steps
        document.querySelectorAll('.workflow-step').forEach(step => {
            step.classList.remove('active');
        });
    }, 500);
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add particle effect on hover for workflow steps
document.querySelectorAll('.workflow-step').forEach(step => {
    step.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(1deg)';
    });
    
    step.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
            this.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe animated elements
document.querySelectorAll('.stat-card, .workflow-step, .insight-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

console.log('🤖 Smart DocOps Agent initialized successfully!');
console.log('📊 AI-powered document processing ready...');
