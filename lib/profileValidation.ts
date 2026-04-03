import { User } from './db';

export interface ProfileRequirements {
    isComplete: boolean;
    missingFields: string[];
    completionPercentage: number;
    canRequestQuotes: boolean;
    canReceiveOrders: boolean;
}

export interface BuyerProfileData {
    companyName?: string;
    gstin?: string;
    address?: string;
    contactPerson?: string;
    contactPhone?: string;
    businessType?: string;
    deliveryLocations?: string[];
}

export interface SellerProfileData {
    companyName?: string;
    gstin?: string;
    address?: string;
    businessRegistration?: string;
    categories?: string[];
    deliveryRadius?: number;
    experienceYears?: number;
    annualRevenue?: string;
}

export function validateBuyerProfile(user: User): ProfileRequirements {
    const missingFields: string[] = [];
    
    // Required fields for buyers
    if (!user.companyName?.trim()) missingFields.push('Company Name');
    if (!user.gstin?.trim()) missingFields.push('GST Number');
    if (!user.address?.trim()) missingFields.push('Registered Office Address');
    if (!user.phone?.trim()) missingFields.push('Contact Phone');
    
    const totalRequired = 4;
    const completionPercentage = Math.round(((totalRequired - missingFields.length) / totalRequired) * 100);
    
    return {
        isComplete: missingFields.length === 0,
        missingFields,
        completionPercentage,
        canRequestQuotes: missingFields.length === 0,
        canReceiveOrders: false // Buyers don't receive orders
    };
}

export function validateSellerProfile(user: User): ProfileRequirements {
    const missingFields: string[] = [];
    
    // Required fields for sellers
    if (!user.companyName?.trim()) missingFields.push('Company Name');
    if (!user.gstin?.trim()) missingFields.push('GST Number');
    if (!user.address?.trim()) missingFields.push('Registered Office Address');
    if (!user.phone?.trim()) missingFields.push('Contact Phone');
    if (!user.experienceYears || user.experienceYears === 0) missingFields.push('Experience Years');
    
    const totalRequired = 5;
    const completionPercentage = Math.round(((totalRequired - missingFields.length) / totalRequired) * 100);
    
    return {
        isComplete: missingFields.length === 0,
        missingFields,
        completionPercentage,
        canRequestQuotes: false, // Sellers don't request quotes
        canReceiveOrders: missingFields.length === 0
    };
}

export function validateProfile(user: User): ProfileRequirements {
    if (user.role === 'buyer') {
        return validateBuyerProfile(user);
    } else if (user.role === 'seller') {
        return validateSellerProfile(user);
    }
    
    // Admin or other roles
    return {
        isComplete: true,
        missingFields: [],
        completionPercentage: 100,
        canRequestQuotes: true,
        canReceiveOrders: true
    };
}

export function getProfileCompletionSteps(user: User): Array<{
    title: string;
    description: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
}> {
    const steps = [];
    
    if (user.role === 'buyer') {
        steps.push(
            {
                title: 'Company Information',
                description: 'Add your company name and business details',
                completed: !!user.companyName?.trim(),
                priority: 'high' as const
            },
            {
                title: 'GST Registration',
                description: 'Enter your GST number for tax compliance',
                completed: !!user.gstin?.trim(),
                priority: 'high' as const
            },
            {
                title: 'Office Address',
                description: 'Provide your registered office address',
                completed: !!user.address?.trim(),
                priority: 'high' as const
            },
            {
                title: 'Contact Details',
                description: 'Add your phone number for communication',
                completed: !!user.phone?.trim(),
                priority: 'high' as const
            }
        );
    } else if (user.role === 'seller') {
        steps.push(
            {
                title: 'Company Information',
                description: 'Add your company name and business details',
                completed: !!user.companyName?.trim(),
                priority: 'high' as const
            },
            {
                title: 'GST Registration',
                description: 'Enter your GST number for tax compliance',
                completed: !!user.gstin?.trim(),
                priority: 'high' as const
            },
            {
                title: 'Office Address',
                description: 'Provide your registered office address',
                completed: !!user.address?.trim(),
                priority: 'high' as const
            },
            {
                title: 'Contact Details',
                description: 'Add your phone number for communication',
                completed: !!user.phone?.trim(),
                priority: 'high' as const
            },
            {
                title: 'Experience',
                description: 'Specify your years of experience in the industry',
                completed: !!user.experienceYears && user.experienceYears > 0,
                priority: 'medium' as const
            }
        );
    }
    
    return steps;
}
