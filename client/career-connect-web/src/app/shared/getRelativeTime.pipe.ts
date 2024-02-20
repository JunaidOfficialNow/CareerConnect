import { NgModule, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'RelativeTime'
})
export class RelativePipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    const currentDate = new Date();
    const creationDate = new Date(value);
    const diff = currentDate.getTime() - creationDate.getTime();
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    
    if (years > 0) {
      return years === 1 ? '1 year ago' : `${years} years ago`;
    } else if (months > 0) {
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else if (days > 0) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else {
      return 'Just now';
    }
  }
  
}

@NgModule({
  declarations: [RelativePipe],
  exports: [RelativePipe],
})
export class RelativePipeModule {}