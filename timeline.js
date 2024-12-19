class Timeline {
    constructor(data, containerSelector = '.content.timeline') {
        this.data = data;
        this.container = document.querySelector(containerSelector);
        this.currentFilter = null;
        this.initialize();
    }

    initialize() {
        // Show all entries by default
        this.render();
        this.setupEventListeners();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
            month: months[date.getMonth()],
            day: String(date.getDate()).padStart(2, '0'),
            year: date.getFullYear(),
            fullDate: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
        };
    }

    createTimelineEntry(entry) {
        const date = this.formatDate(entry.date);
        
        let html = `
            <div class="timeline__card">
                <time class="timeline__date timeline__date--mobile" aria-hidden="true">
                    ${date.fullDate}
                </time>
                <time class="timeline__date timeline__date--desktop">
                    <span class="month">${date.month}</span>
                    <span class="day">${date.day}</span>
                    <span class="timeline__year">${date.year}</span>
                </time>
                <div class="timeline__content">
                    <h3 class="timeline__title">${entry.title}</h3>
                    <p>${entry.content}</p>
                </div>
            </div>`;

        if (entry.relatedArticle) {
            html += `
                <div class="card card--link">
                    <p class="card__category small">
                        <svg class="icon" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                            <title>ionicons-v5-a</title>
                            <polyline points='112 268 256 412 400 268'
                                style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px' />
                            <line x1='256' y1='392' x2='256' y2='100'
                                style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px' />
                        </svg>
                    </p>
                    <h3 class="card__title">
                        <a href="${entry.relatedArticle.url}">
                            ${entry.relatedArticle.title}
                        </a>
                    </h3>
                    <div class="card__excerpt">${entry.relatedArticle.excerpt}</div>
                </div>`;
        }

        return html;
    }

    filterByDateRange(startYear, endYear) {
        return this.data.filter(entry => {
            const year = new Date(entry.date).getFullYear();
            return year >= startYear && year <= endYear;
        });
    }

    filterByYear(year) {
        return this.data.filter(entry => {
            return new Date(entry.date).getFullYear() === year;
        });
    }

    searchEntries(searchTerm) {
        if (!searchTerm) return this.data;
        
        const searchLower = searchTerm.toLowerCase();
        return this.data.filter(entry => {
            return entry.title.toLowerCase().includes(searchLower) ||
                   entry.content.toLowerCase().includes(searchLower);
        });
    }

    sortEntries(entries) {
        return entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    render(entries = this.data) {
        const sortedEntries = this.sortEntries(entries);
        const html = sortedEntries.map(entry => this.createTimelineEntry(entry)).join('');
        this.container.innerHTML = html;
    }

    updateActiveState(clickedButton) {
        // Remove current class from all buttons
        document.querySelectorAll('.page-numbers').forEach(btn => {
            btn.classList.remove('current');
        });
        // Add current class to clicked button
        clickedButton.classList.add('current');
    }

    setupEventListeners() {
        document.querySelectorAll('.page-numbers').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const decade = e.target.textContent;
                
                // Update active state for all cases
                this.updateActiveState(e.target);

                if (decade === 'All') {
                    this.render();
                    return;
                }
                
                // Handle decade format (e.g., "1960s")
                const startYear = parseInt(decade.substring(0, 4));
                const endYear = startYear + 9;
                
                const filteredEntries = this.filterByDateRange(startYear, endYear);
                this.render(filteredEntries);
            });
        });
    }
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof timelineData !== 'undefined') {
        const timeline = new Timeline(timelineData);
    } else {
        console.error('Timeline data not loaded');
    }
});