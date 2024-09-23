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

function paginate(offers, page, itemsPerPage) {
    const totalItems = offers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOffers = offers.slice(startIndex, endIndex);

    return {
        page,
        itemsPerPage,
        totalItems,
        totalPages,
        offers: paginatedOffers
    };
}

// Função para selecionar as propriedades a serem retornadas
function selectProperties(offer, fields) {
    const selectedOffer = {};
    fields.forEach(field => {
        if (offer.hasOwnProperty(field)) {
            selectedOffer[field] = offer[field];
        }
    });
    return selectedOffer;
}

exports.getFormattedOffers = (req, res) => {
    const filters = {
        level: req.query.level,
        kind: req.query.kind,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        courseName: req.query.courseName
    };

    const sortBy = req.query.sortBy;

    // Parâmetros de paginação
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

    // Aplicar filtros e ordenação
    const filteredAndSortedOffers = applyFiltersAndSorting(offers, filters, sortBy);

    // Aplicar paginação
    const paginatedOffers = paginate(filteredAndSortedOffers, page, itemsPerPage);

    // Formatar os resultados
    const formattedOffers = paginatedOffers.offers.map(offer => ({
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

    // Seleção de propriedades (se o parâmetro "fields" estiver presente)
    let finalOffers = formattedOffers;
    if (req.query.fields) {
        const fields = req.query.fields.split(',').map(field => field.trim());
        finalOffers = formattedOffers.map(offer => selectProperties(offer, fields));
    }

    res.json({
        page: paginatedOffers.page,
        itemsPerPage: paginatedOffers.itemsPerPage,
        totalItems: paginatedOffers.totalItems,
        totalPages: paginatedOffers.totalPages,
        offers: finalOffers
    });
};
