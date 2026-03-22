// Billing Data Constants — Category → Size / Type / Unit mappings

export interface CategoryConfig {
    sizes: string[];
    types: string[];
    units: string[];
}

export const BRANDS: Record<string, string[]> = {
    'PPC': ['Ramco', 'Ultratech', 'ACC', 'JK Lakshmi', 'Shree Cement', 'Bharathi'],
    'OPC 43': ['Ramco', 'Ultratech', 'ACC', 'JK Lakshmi', 'Shree Cement', 'Bharathi'],
    'OPC 53': ['Ramco', 'Ultratech', 'ACC', 'JK Lakshmi', 'Shree Cement', 'Bharathi'],
    'PSC': ['Ramco', 'Ultratech', 'ACC', 'JK Lakshmi', 'Shree Cement', 'Bharathi'],
    'TMT': ['TATA Tiscon', 'JSW Steel', 'SAIL', 'Vizag Steel', 'Kamdhenu', 'SRMB'],
    'MS': ['TATA Tiscon', 'JSW Steel', 'SAIL', 'Vizag Steel', 'Kamdhenu', 'SRMB'],
    'Red Brick': ['Kashmir Bricks', 'AP Bricks', 'Local Bricks'],
    'Fly Ash Brick': ['Kashmir Bricks', 'AP Bricks', 'Local Bricks'],
    'Wire Cut Brick': ['Kashmir Bricks', 'AP Bricks', 'Local Bricks'],
    'Standard': ['AAC Blocks Ltd', 'Magicrete', 'HIL'],
    'Jumbo': ['AAC Blocks Ltd', 'Magicrete', 'HIL'],
    'River Sand': ['Local Sand Suppliers', 'Construction Sand Co'],
    'P-Sand': ['Local Sand Suppliers', 'Construction Sand Co'],
    'Manufactured Sand': ['Local Sand Suppliers', 'Construction Sand Co'],
    'Blue Metal': ['Local Quarry', 'Stone Crushers'],
    'Granite': ['Local Quarry', 'Stone Crushers']
};

export const CATEGORIES: Record<string, CategoryConfig> = {
    Cement: {
        sizes: ['-'],
        types: ['PPC', 'OPC 43', 'OPC 53', 'PSC'],
        units: ['Bags'],
    },
    Steel: {
        sizes: ['8mm', '10mm', '12mm', '16mm', '20mm', '25mm', '32mm'],
        types: ['TMT', 'MS'],
        units: ['Tons', 'Kg'],
    },
    Bricks: {
        sizes: ['9×4×3', '9×4×2'],
        types: ['Red Brick', 'Fly Ash Brick', 'Wire Cut Brick'],
        units: ['Nos', '1000 Nos'],
    },
    'AAC Blocks': {
        sizes: ['600×200×100', '600×200×150', '600×200×200', '600×200×230'],
        types: ['Standard', 'Jumbo'],
        units: ['Nos', 'Cubic Meter'],
    },
    Sand: {
        sizes: ['Fine', 'Coarse', 'M-Sand'],
        types: ['River Sand', 'P-Sand', 'Manufactured Sand'],
        units: ['Cubic Feet', 'Tons', 'Units'],
    },
    Jelly: {
        sizes: ['6mm', '12mm', '20mm', '40mm'],
        types: ['Blue Metal', 'Granite'],
        units: ['Cubic Feet', 'Tons', 'Units'],
    },
    Other: {
        sizes: ['-'],
        types: ['-'],
        units: ['Nos', 'Bags', 'Tons', 'Kg', 'Cubic Feet', 'Cubic Meter', 'Litres', 'Sq.Ft', 'Running Feet'],
    },
};

export const CATEGORY_LIST = Object.keys(CATEGORIES);

export const GST_RATE = 0.18; // 18%
