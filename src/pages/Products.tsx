import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ProductModal } from "@/components/ProductModal";
import { Product, ProductFormData } from "@/types/product";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "ERP System",
      description: "Enterprise Resource Planning system for business management",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15")
    },
    {
      id: "2", 
      name: "Mobile App",
      description: "Customer-facing mobile application",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-10")
    }
  ]);

  const handleCreateProduct = (data: ProductFormData) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (id: string, data: ProductFormData) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, ...data, updatedAt: new Date() }
        : product
    ));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success("Product deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product portfolio and organize projects
          </p>
        </div>
        
        <ProductModal
          mode="create"
          onSave={handleCreateProduct}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No products found. Create your first product to get started.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="max-w-md">
                      {product.description || (
                        <span className="text-muted-foreground italic">No description</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(product.createdAt, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(product.updatedAt, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ProductModal
                          mode="edit"
                          product={product}
                          onSave={(data) => handleUpdateProduct(product.id, data)}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{product.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return p.updatedAt > weekAgo;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Updated this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-sm">
              {products.length > 0 ? 'Active' : 'No Products'}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}