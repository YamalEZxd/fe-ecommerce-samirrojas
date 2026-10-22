import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../models/producto.model';
import { ProductoFormComponent } from '../producto-form/producto-form';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ProductoFormComponent],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  private productoService = inject(ProductoService);
  productos = signal<Producto[]>([]);
  formulario = viewChild.required(ProductoFormComponent);

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  editar(producto: Producto): void {
    this.formulario().editarProducto(producto);
  }

  eliminar(id: number | undefined): void {
    if (!id || !confirm('¿Seguro que desea eliminar este producto?')) return;
    this.productoService.eliminarProducto(id).subscribe({
      next: () => this.cargarProductos(),
      error: (err) => console.error('Error al eliminar', err)
    });
  }
}
