document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments variant
    const sizeSelect = document.getElementById('sylius_shop_add_to_cart_cartItem_variant_SIZE');
    const csvSelect = document.getElementById('sylius_shop_add_to_cart_cartItem_variant_CSV');
    const productMainImage = document.getElementById('product-main-image');

    // Fonction pour afficher les informations
    const logVariantInfo = () => {
        const selectedSize = sizeSelect ? sizeSelect.value : null;
        const selectedCsv = csvSelect ? csvSelect.value : null;
        const hasImage = productMainImage && productMainImage.src;

        console.log('Variant sélectionné:');
        console.log('Taille:', selectedSize);
        console.log('Cadre sous verre:', selectedCsv);
        console.log('L\'image est présente:', hasImage ? productMainImage.src : 'Aucune image trouvée');
    };

    // Ajout des écouteurs d'événements
    if (sizeSelect) {
        sizeSelect.addEventListener('change', logVariantInfo);
    }

    if (csvSelect) {
        csvSelect.addEventListener('change', logVariantInfo);
    }

    // Log initial
    logVariantInfo();
});




document.addEventListener('DOMContentLoaded', function () {
    const mainImage = document.getElementById('product-main-image');
    const optionSelectors = document.querySelectorAll('[data-variant-option]');
    const defaultImageUrl = mainImage ? mainImage.src : null;

    // Fonction pour vérifier la variante sélectionnée et son image
    function updateMainImage() {
        const selectedVariant = document.querySelector('[data-variant-selected="true"]'); // Assurez-vous que votre structure inclut cet attribut.
        if (selectedVariant) {
            const variantId = selectedVariant.getAttribute('data-variant-id');
            const variantImage = selectedVariant.getAttribute('data-image');

            console.log(`Variant sélectionné : ${variantId}`);
            if (variantImage) {
                console.log(`Image associée : ${variantImage}`);
                mainImage.src = variantImage;
            } else {
                console.log(`Aucune image pour ce variant.`);
                if (defaultImageUrl) {
                    mainImage.src = defaultImageUrl; // Revenir à l'image par défaut.
                }
            }
        } else {
            console.log(`Aucun variant sélectionné.`);
            if (defaultImageUrl) {
                mainImage.src = defaultImageUrl;
            }
        }
    }

    // Écouteur pour chaque sélecteur d'option
    optionSelectors.forEach(selector => {
        selector.addEventListener('change', function () {
            console.log(`Option modifiée : ${this.getAttribute('name')}, valeur : ${this.value}`);
            updateMainImage();
        });
    });

    // Initialiser l'image à l'ouverture de la page
    console.log('Initialisation de la page...');
    updateMainImage();
});
