const offers = require('../data.json').offers;

function formatPrice(price) {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDiscount(fullPrice, offeredPrice) {
    const discount = ((fullPrice - offeredPrice) / fullPrice) * 100;
    return `${discount.toFixed(0)}% 📉`;
}

function formatKind(kind) {
    return kind === 'presencial' ? 'Presencial 🏫' : 'EaD 🏠';
}

function formatLevel(level) {
    switch(level) {
        case 'bacharelado':
            return 'Graduação (bacharelado) 🎓';
        case 'tecnologo':
            return 'Graduação (tecnólogo) 🎓';
        case 'licenciatura':
            return 'Graduação (licenciatura) 🎓';
        default:
            return level;
    }
}

// Função para aplicar filtros, busca e ordenação
function applyFiltersAndSorting(offers, filters, sortBy) {
    let filteredOffers = [...offers];

    // Filtro por nível (graduação, tecnólogo, licenciatura)
    if (filters.level) {
        const levels = filters.level.split(',').map(level => level.trim());
        filteredOffers = filteredOffers.filter(offer => levels.includes(offer.level));
    }

    // Filtro por modalidade (presencial, ead)
    if (filters.kind) {
        const kinds = filters.kind.split(',').map(kind => kind.trim());
        filteredOffers = filteredOffers.filter(offer => kinds.includes(offer.kind));
    }

    // Filtro por preço com desconto
    if (filters.minPrice || filters.maxPrice) {
        const minPrice = parseFloat(filters.minPrice) || 0;
        const maxPrice = parseFloat(filters.maxPrice) || Number.MAX_VALUE;
        filteredOffers = filteredOffers.filter(offer => offer.offeredPrice >= minPrice && offer.offeredPrice <= maxPrice);
    }

    // Busca por nome do curso (case-insensitive)
    if (filters.courseName) {
        const searchQuery = filters.courseName.toLowerCase();
        filteredOffers = filteredOffers.filter(offer => offer.courseName.toLowerCase().includes(searchQuery));
    }

    // Ordenação
    if (sortBy) {
        switch (sortBy) {
            case 'courseName':
                filteredOffers.sort((a, b) => a.courseName.localeCompare(b.courseName));
                break;
            case 'offeredPrice':
                filteredOffers.sort((a, b) => a.offeredPrice - b.offeredPrice);
                break;
            case 'rating':
                filteredOffers.sort((a, b) => b.rating - a.rating);
                break;
        }
    }

    return filteredOffers;
}

// Controlador principal
exports.getFormattedOffers = (req, res) => {
    const filters = {
        level: req.query.level,
        kind: req.query.kind,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        courseName: req.query.courseName
    };

    const sortBy = req.query.sortBy;

    // Aplicar filtros e ordenação
    const filteredAndSortedOffers = applyFiltersAndSorting(offers, filters, sortBy);

    // Formatar os resultados
    const formattedOffers = filteredAndSortedOffers.map(offer => ({
        courseName: offer.courseName,
        rating: offer.rating,
        fullPrice: formatPrice(offer.fullPrice),
        offeredPrice: formatPrice(offer.offeredPrice),
        discount: formatDiscount(offer.fullPrice, offer.offeredPrice),
        kind: formatKind(offer.kind),
        level: formatLevel(offer.level),
        iesLogo: offer.iesLogo,
        iesName: offer.iesName
    }));

    res.json(formattedOffers);
};
