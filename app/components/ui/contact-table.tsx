// Define Contact interface since shared/schema no longer exists
interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number | null
  gender: string | null
  location: string | null
  lastPurchase: string | null
  purchaseDate: string | null
  totalSpent: number | null
  personalityType: string | null
  communicationStyle: string | null
  interests: string | null
  createdAt: string
  updatedAt: string
}
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface ContactTableProps {
  contacts: Contact[];
  onEditContact: (contact: Contact) => void;
}

export default function ContactTable({ contacts, onEditContact }: ContactTableProps) {
  const getPersonalityColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'analytical':
        return 'bg-blue-100 text-blue-800';
      case 'creative':
        return 'bg-green-100 text-green-800';
      case 'social':
        return 'bg-purple-100 text-purple-800';
      case 'practical':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Demographics
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Purchase
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Personality
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {getInitials(contact.firstName, contact.lastName)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {contact.age && `Age: ${contact.age}`}
                  {contact.gender && contact.age && ', '}
                  {contact.gender}
                </div>
                <div className="text-sm text-gray-500">{contact.location}</div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="text-sm text-gray-900">{contact.lastPurchase}</div>
                <div className="text-sm text-gray-500">
                  {contact.purchaseDate && 
                    new Date(contact.purchaseDate).toLocaleDateString()
                  }
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {contact.personalityType && (
                  <Badge className={getPersonalityColor(contact.personalityType)}>
                    {contact.personalityType}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditContact(contact)}
                  className="text-primary hover:text-blue-700"
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
