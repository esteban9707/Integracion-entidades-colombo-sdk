import { Injectable } from '@nestjs/common';
import {
  SalesOrder,
  SalesOrderItem,
  salesOrderService,
} from 'services/sales-order-service';
const { salesOrderApi, salesOrderItemApi } = salesOrderService();

@Injectable()
export class SalesOrderService {
  destination = {
    url: 'https://my405807-api.s4hana.cloud.sap',
    username: 'USER_ADMINISTRATOR_HBT',
    password: 'AHyGnbty8neBGTVtGtbgJmpyoV#VtibskwjUTUou',
  };

  //destination = JSON.parse(process.env.destination);
  async getAllSalesOrder(): Promise<SalesOrder[]> {
    try {
      return await salesOrderApi
        .requestBuilder()
        .getAll()
        .addCustomHeaders({ Accept: 'application/json' })
        .execute(this.destination);
    } catch (error) {
      console.error('Error en getAllSalesOrder:', error);
      throw error;
    }
  }

  async getSalesOrderById(id: string): Promise<SalesOrder> {
    try {
      return await salesOrderApi
        .requestBuilder()
        .getByKey(id)
        .addCustomHeaders({ Accept: 'application/json' })
        .execute(this.destination);
    } catch (error) {
      console.error('Error en getSalesOrderById:', error);
      throw error;
    }
  }

  async createSalesOrder(salesOrder: Record<string, any>) {
    try {
      const salesOrderItemsArray = salesOrder.to_Item.results;

      const salerOrderItems = salesOrderItemsArray.map((item) => {
        return salesOrderItemApi.entityBuilder().fromJson(item);
      });
      const salesOrderEntity = salesOrderApi
        .entityBuilder()
        .toItem(salerOrderItems)
        .fromJson(salesOrder);

      return await salesOrderApi
        .requestBuilder()
        .create(salesOrderEntity)
        .addCustomHeaders({ Accept: 'application/json' })
        .execute(this.destination);
    } catch (error) {
      console.error('Error en createSalesOrder:', error);
      throw error;
    }
  }

  async deleteSalesOrder(salesOrderId): Promise<string> {
    try {
      const response = await salesOrderApi
        .requestBuilder()
        .getByKey(salesOrderId)
        .addCustomHeaders({ Accept: 'application/json' })
        .execute(this.destination);

      await salesOrderApi
        .requestBuilder()
        .delete(response)
        .execute(this.destination);
      return 'La orden de venta se eliminó correctamente.';
    } catch (err) {
      throw err;
    }
  }

  async updateSalesOrder(requestBody, salesOrderId): Promise<SalesOrder> {
    try {
      const response = await salesOrderApi
        .requestBuilder()
        .getByKey(salesOrderId)
        .addCustomHeaders({ Accept: 'application/json' })
        .execute(this.destination);

      Object.assign(response, requestBody);

      return await salesOrderApi
        .requestBuilder()
        .update(response)
        .execute(this.destination);
    } catch (error) {
      console.error('Error en updateSalesOrder:', error);
      throw error;
    }
  }

  async createSalesOrderItem(
    sales: Record<string, any>,
    salesOrderId: string,
  ): Promise<SalesOrderItem> {
    const salesOrderItem = salesOrderItemApi
      .entityBuilder()
      .fromJson({ salesOrder: salesOrderId, ...sales });

    return await salesOrderItemApi
      .requestBuilder()
      .create(salesOrderItem)
      .execute(this.destination);
  }

  async getSalesOrderItem(salesOrderId: string): Promise<SalesOrder> {
    try {
      return await salesOrderApi
        .requestBuilder()
        .getByKey(salesOrderId)
        .select(salesOrderApi.schema.TO_ITEM)
        .addCustomHeaders({ Accept: 'application/json' })
        .execute(this.destination);
    } catch (error) {
      console.error('Error en getSalesOrderItem:', error);
      throw error;
    }
  }

  async getSalesOrderItemById(
    salesOrderId: string,
    salesOrderItemId: string,
  ): Promise<SalesOrderItem> {
    try {
      return await salesOrderItemApi
        .requestBuilder()
        .getByKey(salesOrderId, salesOrderItemId)
        .addCustomHeaders({ Accept: 'application/json' })
        .execute(this.destination);
    } catch (error) {
      console.error('Error en getSalesOrderItemById:', error);
      throw error;
    }
  }
}
