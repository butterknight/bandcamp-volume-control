var MarkupControlFactory = {
    getMarkupControlByType: function (type) {
        console.log('Player type:', type);
        switch (type) {
            case 'small':
                return new MarkupControlSmall();
            case 'large':
                return new MarkupControlLarge();
            case 'page':
                return new MarkupControlPage();
            case 'discover':
                return new MarkupControlDiscover();
            default:
                throw new Error("Sorry, but there's no markup control for this type of player.");
        }
    }
};