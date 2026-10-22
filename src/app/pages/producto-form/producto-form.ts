import { Component, signal, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoFormComponent {
  private productoService = inject(ProductoService);
  productoGuardado = output<void>();

  producto = signal<Producto>(this.productoVacio());

  private productoVacio(): Producto {
    return { nombre: '', categoria: '', precio: 0.01, stock: 0, marca: '', codigoBarras: '' };
  }

  editarProducto(seleccionado: Producto) {
    this.producto.set({ ...seleccionado });
  }

  guardar() {
    const datos = this.producto();
    if (datos.precio <= 0 || datos.stock < 0) {
      alert('Por favor verifique que el precio sea mayor a 0 y el stock no sea negativo.');
      return;
    }
    const peticion = datos.id
      ? this.productoService.actualizarProducto(datos.id, datos)
      : this.productoService.crearProducto(datos);

    peticion.subscribe({
      next: () => {
        this.productoGuardado.emit();
        this.limpiarFormulario();
      },
      error: (error) => console.error('Error al guardar el producto', error)
    });
  }

  limpiarFormulario() {
    this.producto.set(this.productoVacio());
  }
}
