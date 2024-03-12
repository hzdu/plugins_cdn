interface TrustBadgeInterface {
    id: string;
    image: any; // Change the type based on your actual image type, e.g., string for a URL
    title: string;
    subtitle: string;
    description: string;
    template: string;
    mode: string;
}

export default TrustBadgeInterface;
