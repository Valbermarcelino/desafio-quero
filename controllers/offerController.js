exports.getFormattedOffers = (req, res) => {
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

    const formattedOffers = offers.map(offer => ({
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
